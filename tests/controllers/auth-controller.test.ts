import bcrypt from "bcrypt";
import { Request, Response } from "express";
import db from "../../src/config/knex";
import {
  getUserProfile,
  signIn,
  signUp,
} from "../../src/controllers/auth-controller";
import { generateToken } from "../../src/utils/generate-token";

// --- 🔹 Mock dependencies ---
jest.mock("../../src/config/knex", () => jest.fn()); // ✅ note path fixed to match src location
jest.mock("bcrypt");
jest.mock("../../src/utils/generate-token");

// Helper to create chainable db mock
function createDbMock() {
  return {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    del: jest.fn().mockReturnThis(),
  };
}

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("signUp", () => {
    it("should create a new user when email does not exist", async () => {
      mockReq = {
        body: {
          email: "newuser@test.com",
          name: "Test User",
          password: "password123",
        },
      };

      const dbMock = createDbMock();
      dbMock.first.mockResolvedValue(undefined);
      dbMock.returning.mockResolvedValue([
        {
          id: 1,
          email: "newuser@test.com",
          username: "Test User",
          created_at: new Date(),
        },
      ]);

      (db as unknown as jest.Mock).mockReturnValue(dbMock);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");

      await signUp(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User created successfully",
          user: expect.objectContaining({
            email: "newuser@test.com",
          }),
        })
      );
    });

    it("should return 409 if email already exists", async () => {
      mockReq = {
        body: {
          email: "existing@test.com",
          name: "Test User",
          password: "password123",
        },
      };

      const dbMock = createDbMock();
      dbMock.first.mockResolvedValue({ id: 1, email: "existing@test.com" });

      (db as unknown as jest.Mock).mockReturnValue(dbMock);

      await signUp(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User with this email already exists.",
      });
    });
  });

  describe("signIn", () => {
    it("should return 404 if user not found", async () => {
      mockReq = { body: { email: "nouser@test.com", password: "pass" } };

      const dbMock = createDbMock();
      dbMock.first.mockResolvedValue(undefined);

      (db as unknown as jest.Mock).mockReturnValue(dbMock);

      await signIn(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 401 if password is invalid", async () => {
      mockReq = { body: { email: "user@test.com", password: "wrong" } };

      const dbMock = createDbMock();
      dbMock.first.mockResolvedValue({ password_hash: "hashedpass" });

      (db as unknown as jest.Mock).mockReturnValue(dbMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await signIn(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return token and user on successful login", async () => {
      mockReq = { body: { email: "user@test.com", password: "correct" } };

      const mockUser = {
        id: 1,
        email: "user@test.com",
        username: "User",
        password_hash: "hashed",
        created_at: new Date(),
      };

      const dbMock = createDbMock();
      dbMock.first.mockResolvedValue(mockUser);

      (db as unknown as jest.Mock).mockReturnValue(dbMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("mocktoken");

      await signIn(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Login successful",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          created_at: mockUser.created_at,
        },
        token: "mocktoken",
      });
    });
  });

  describe("getUserProfile", () => {
    it("should return 404 if user not found", async () => {
      mockReq = { user: { userId: 999 } } as any;

      const dbMock = createDbMock();
      dbMock.first.mockResolvedValue(undefined);

      (db as unknown as jest.Mock).mockReturnValue(dbMock);

      await getUserProfile(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return user profile if found", async () => {
      const mockUser = {
        id: 1,
        email: "user@test.com",
        username: "User",
        created_at: new Date(),
      };
      mockReq = { user: { userId: 1 } } as any;

      const dbMock = createDbMock();
      dbMock.first.mockResolvedValue(mockUser);

      (db as unknown as jest.Mock).mockReturnValue(dbMock);

      await getUserProfile(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });
  });
});
