package com.icu.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.icu.config.MongoDBConnection;
import com.icu.util.JsonUtil;
import com.icu.util.JwtUtil;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String path = req.getPathInfo();
        if (path == null) {
            path = "";
        }

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> users = db.getCollection("users");

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String body = JsonUtil.readBody(req);

        if (body == null || body.trim().isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"Request body is empty\"}");
            return;
        }

        JsonObject json;
        try {
            json = gson.fromJson(body, JsonObject.class);
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"Invalid JSON format\"}");
            return;
        }

        if ("/login".equals(path)) {

            if (!json.has("email") || !json.has("password")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"Email and password are required\"}");
                return;
            }

            String email = json.get("email").getAsString().trim();
            String password = json.get("password").getAsString().trim();

            Document user = users.find(new Document("email", email)
                    .append("password", password)).first();

            if (user != null) {
                String token = JwtUtil.generateToken(email);

                JsonObject result = new JsonObject();
                result.addProperty("token", token);
                result.addProperty("email", user.getString("email"));
                result.addProperty("name", user.getString("name"));
                result.addProperty("role", user.getString("role"));

                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write(gson.toJson(result));
            } else {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write("{\"message\":\"Invalid email or password\"}");
            }

        } else if ("/signup".equals(path)) {

            if (!json.has("name") || !json.has("email") || !json.has("password")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"Name, email and password are required\"}");
                return;
            }

            String name = json.get("name").getAsString().trim();
            String email = json.get("email").getAsString().trim();
            String password = json.get("password").getAsString().trim();

            if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"All fields are required\"}");
                return;
            }

            Document existing = users.find(new Document("email", email)).first();

            if (existing != null) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write("{\"message\":\"Email already exists\"}");
                return;
            }

            Document newUser = new Document("name", name)
                    .append("email", email)
                    .append("password", password)
                    .append("role", "user");

            users.insertOne(newUser);

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("{\"message\":\"Signup successful. Please login.\"}");

        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"message\":\"Invalid auth route\"}");
        }
    }
}