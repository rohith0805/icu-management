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

public class BedServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String hospitalName = req.getParameter("hospitalName");

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> beds = db.getCollection("beds");

        List<Document> list;
        if (hospitalName != null && !hospitalName.isEmpty()) {
            list = beds.find(new Document("hospitalName", hospitalName)).into(new ArrayList<>());
        } else {
            list = beds.find().into(new ArrayList<>());
        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(list));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> beds = db.getCollection("beds");

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

        if (json == null || !json.has("hospitalName") || !json.has("bedNumber") || !json.has("status")) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Missing required fields for bed creation");
            return;
        }

        Document bed = new Document("hospitalName", json.get("hospitalName").getAsString())
                .append("bedNumber", json.get("bedNumber").getAsString())
                .append("status", json.get("status").getAsString());

        beds.insertOne(bed);

        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\":\"Bed created successfully\"}");
    }
}