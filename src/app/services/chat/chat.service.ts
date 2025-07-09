import AppDataSource from "@config/datasource";
import env from "@config/env";
import axios from "axios";
import { Request, Response } from "express";
import { Readable } from "stream";
import { DataSource } from "typeorm";

export default class ChatService {
  constructor(private readonly dataSource: DataSource = AppDataSource) {}

  async sendMessage(
    message: string,
    req: Request,
    res: Response
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-4o",
          messages: [
            {
              role: "user",
              content: "What is the meaning of life?",
            },
          ],
          stream: true,
        },
        {
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://slm-store.vercel.app/",
            "X-Title": "SLM Store",
          },
          responseType: "stream",
        },
      );
      const data = response.data;

      await queryRunner.commitTransaction();

      const stream = response.data as Readable;
      let buffer = "";

      stream.on("data", (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");

        // Keep the last incomplete line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();

            if (jsonStr === "[DONE]") {
              res.write("data: [DONE]\n\n");
              res.end();
              return;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;

              if (content) {
                // Send the chunk to client
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
              }
            } catch (parseError) {
              // Skip malformed JSON
            }
          }
        }
      });

      stream.on("end", () => {
        res.write("data: [DONE]\n\n");
        res.end();
      });

      stream.on("error", (error: Error) => {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      });

      // Handle client disconnect
      req.on("close", () => {
        stream.destroy();
      });

    //   return data;
    } catch (error) {
    //   await queryRunner.rollbackTransaction();
      throw error;
    } finally {
    //   await queryRunner.release();
    }
  }
}
