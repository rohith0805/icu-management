package com.icu.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.icu.config.MongoDBConnection;
import com.icu.util.JsonUtil;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class HospitalServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> hospitals = db.getCollection("hospitals");

        List<Document> list = hospitals.find().into(new ArrayList<>());
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(list));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> hospitals = db.getCollection("hospitals");

        String body = JsonUtil.readBody(req);
        if (body == null || body.isBlank()) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Request body is empty");
            return;
        }

        JsonObject json;
        try {
            json = gson.fromJson(body, JsonObject.class);
        } catch (Exception e) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid JSON");
            return;
        }

        if (json == null || !json.has("name") || !json.has("address") || !json.has("totalBeds") || !json.has("availableBeds")) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Missing required fields for hospital creation");
            return;
        }

        Document hospital = new Document("name", json.get("name").getAsString())
                .append("address", json.get("address").getAsString())
                .append("totalBeds", json.get("totalBeds").getAsInt())
                .append("availableBeds", json.get("availableBeds").getAsInt());

        hospitals.insertOne(hospital);

        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\":\"Hospital added successfully\"}");
    }
}