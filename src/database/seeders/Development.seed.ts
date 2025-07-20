import AppDataSource from "../../config/datasource";
import UserEntity from "../entities/User.entity";
import AgentEntity from "../entities/Agent.entity";
import ChatSessionEntity from "../entities/ChatSession.entity";
import ChatMessageEntity from "../entities/ChatMessage.entity";
import bcrypt from "bcryptjs";

export default class DevelopmentSeeder {
  async run(): Promise<void> {
    console.log("🔧 Running development seeder for additional test data...");

    const userRepository = AppDataSource.getRepository(UserEntity);
    const agentRepository = AppDataSource.getRepository(AgentEntity);
    const chatSessionRepository = AppDataSource.getRepository(ChatSessionEntity);
    const chatMessageRepository = AppDataSource.getRepository(ChatMessageEntity);

    // Create additional test users
    const testUsers = [
      {
        name: "Alice Johnson",
        username: "alice.johnson",
        email: "alice.johnson@test.com",
        password: "testpass123",
        isEmailVerified: true
      },
      {
        name: "Bob Wilson",
        username: "bob.wilson",
        email: "bob.wilson@test.com",
        password: "testpass123",
        isEmailVerified: false
      },
      {
        name: "Charlie Brown",
        username: "charlie.brown",
        email: "charlie.brown@test.com",
        password: "testpass123",
        isEmailVerified: true
      }
    ];

    // Check if development users already exist
    const existingDevUser = await userRepository.findOne({ 
      where: { username: "alice.johnson" } 
    });

    if (!existingDevUser) {
      const userEntities = await Promise.all(
        testUsers.map(async userData => {
          const entity = new UserEntity();
          entity.name = userData.name;
          entity.username = userData.username;
          entity.email = userData.email;
          entity.password = await bcrypt.hash(userData.password, 10);
          entity.isEmailVerified = userData.isEmailVerified;
          return entity;
        })
      );

      await userRepository.save(userEntities);
      console.log(`✅ Created ${userEntities.length} development users`);
    } else {
      console.log("Development users already exist, skipping...");
    }

    // Get existing data for sample chat sessions
    const users = await userRepository.find({ take: 3 });
    const agents = await agentRepository.find({ take: 2 });

    if (users.length > 0 && agents.length > 0) {
      // Check if sample sessions already exist
      const existingSessions = await chatSessionRepository.count();
      if (existingSessions === 0) {
        // Create sample chat sessions
        const sampleSessions = [
          {
            user: users[0],
            name: "Help with React Components"
          },
          {
            user: users[1],
            name: "Creative Story Writing"
          },
          {
            user: users[0],
            name: "Data Analysis Project"
          }
        ];

        const sessionEntities = sampleSessions.map(sessionData => {
          const entity = new ChatSessionEntity();
          entity.user = sessionData.user;
          entity.name = sessionData.name;
          return entity;
        });

        await chatSessionRepository.save(sessionEntities);
        console.log(`✅ Created ${sessionEntities.length} sample chat sessions`);

        // Create sample chat messages for the first session
        const firstSession = sessionEntities[0];
        const sampleMessages = [
          {
            chatSession: firstSession,
            content: "Can you help me create a React component for a todo list?",
            isUserMessage: true
          },
          {
            chatSession: firstSession,
            content: "I'd be happy to help you create a React todo list component! Here's a comprehensive example:\n\n```jsx\nimport React, { useState } from 'react';\n\nconst TodoList = () => {\n  const [todos, setTodos] = useState([]);\n  const [inputValue, setInputValue] = useState('');\n\n  const addTodo = () => {\n    if (inputValue.trim()) {\n      setTodos([...todos, {\n        id: Date.now(),\n        text: inputValue,\n        completed: false\n      }]);\n      setInputValue('');\n    }\n  };\n\n  return (\n    <div>\n      <h2>Todo List</h2>\n      <input \n        value={inputValue}\n        onChange={(e) => setInputValue(e.target.value)}\n        placeholder=\"Add a new todo\"\n      />\n      <button onClick={addTodo}>Add</button>\n      <ul>\n        {todos.map(todo => (\n          <li key={todo.id}>{todo.text}</li>\n        ))}\n      </ul>\n    </div>\n  );\n};\n\nexport default TodoList;\n```\n\nThis component includes basic functionality for adding todos. Would you like me to add features for completing or deleting todos as well?",
            isUserMessage: false
          },
          {
            chatSession: firstSession,
            content: "Yes, please add the ability to mark todos as complete and delete them.",
            isUserMessage: true
          }
        ];

        const messageEntities = sampleMessages.map(messageData => {
          const entity = new ChatMessageEntity();
          entity.chatSession = messageData.chatSession;
          entity.content = messageData.content;
          entity.isUserMessage = messageData.isUserMessage;
          return entity;
        });

        await chatMessageRepository.save(messageEntities);
        console.log(`✅ Created ${messageEntities.length} sample chat messages`);
      } else {
        console.log("Sample chat sessions already exist, skipping...");
      }
    }

    console.log("✅ Development seeding completed!");
  }
}
