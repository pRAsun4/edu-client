const demoUserData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123", // Use plain text for simplicity in the demo
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "123-456-7890",
      address: {
        street: "123 Main St",
        city: "Kolkata",
        state: "West Bengal",
        country: "India",
        postalCode: "700001",
      },
    },
    permissions: ["CREATE_USER", "EDIT_USER", "DELETE_USER", "VIEW_REPORTS"],
    settings: { theme: "dark", notificationsEnabled: true },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password123",
    role: "ORGANIZATION_ADMIN",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "987-654-3210",
      address: {
        street: "456 Market St",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400001",
      },
    },
    permissions: ["EDIT_USER", "VIEW_REPORTS"],
    settings: { theme: "light", notificationsEnabled: false },
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    password: "password123",
    role: "MEMBER",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "Alice",
      lastName: "Johnson",
      phoneNumber: "555-123-4567",
      address: {
        street: "789 Park Ave",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        postalCode: "110001",
      },
    },
    permissions: ["VIEW_REPORTS"],
    settings: { theme: "dark", notificationsEnabled: true },
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    password: "password123",
    role: "STUDENT",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "Bob",
      lastName: "Brown",
      phoneNumber: "444-333-2222",
      address: {
        street: "12 Elm St",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        postalCode: "560001",
      },
    },
    permissions: [],
    settings: { theme: "light", notificationsEnabled: true },
  },
  {
    id: 5,
    name: "Chris Brown",
    email: "chris.brown@example.com",
    password: "password123",
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "Charlie",
      lastName: "Wilson",
      phoneNumber: "111-222-3333",
      address: {
        street: "34 Oak St",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        postalCode: "500001",
      },
    },
    permissions: ["CREATE_USER", "EDIT_USER"],
    settings: { theme: "dark", notificationsEnabled: false },
  },
  {
    id: 6,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    password: "password123",
    role: "ORGANIZATION_ADMIN",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "Diana",
      lastName: "Prince",
      phoneNumber: "666-777-8888",
      address: {
        street: "56 Maple St",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        postalCode: "600001",
      },
    },
    permissions: ["VIEW_REPORTS"],
    settings: { theme: "light", notificationsEnabled: true },
  },
  {
    id: 7,
    name: "David Lee",
    email: "david.lee@example.com",
    password: "password123",
    role: "MEMBER",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "Eve",
      lastName: "Adams",
      phoneNumber: "999-888-7777",
      address: {
        street: "78 Birch St",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        postalCode: "411001",
      },
    },
    permissions: [],
    settings: { theme: "dark", notificationsEnabled: false },
  },
  {
    id: 8,
    name: "Sophia White",
    email: "sophia.white@example.com",
    password: "password123",
    role: "STUDENT",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "Frank",
      lastName: "Castle",
      phoneNumber: "555-666-7777",
      address: {
        street: "90 Cedar St",
        city: "Kolkata",
        state: "West Bengal",
        country: "India",
        postalCode: "700002",
      },
    },
    permissions: ["EDIT_USER", "DELETE_USER"],
    settings: { theme: "light", notificationsEnabled: true },
  },
  {
    id: 9,
    name: "Andrew Walker",
    email: "andrew.walker@example.com",
    password: "password123",
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "Grace",
      lastName: "Lee",
      phoneNumber: "111-222-4444",
      address: {
        street: "23 Willow St",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        postalCode: "400002",
      },
    },
    permissions: ["CREATE_USER", "EDIT_USER", "DELETE_USER", "VIEW_REPORTS"],
    settings: { theme: "dark", notificationsEnabled: true },
  },
  {
    id: 10,
    name: "Jessica Martinez",
    email: "jessica.martinez@example.com",
    password: "password123",
    role: "ORGANIZATION_ADMIN",
    isActive: true,
    createdAt: "2025-01-16T12:00:00.000Z",
    updatedAt: "2025-01-16T12:00:00.000Z",
    profile: {
      firstName: "Henry",
      lastName: "Green",
      phoneNumber: "333-444-5555",
      address: {
        street: "45 Spruce St",
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India",
        postalCode: "380001",
      },
    },
    permissions: ["VIEW_REPORTS"],
    settings: { theme: "light", notificationsEnabled: false },
  },
];

export default demoUserData;
