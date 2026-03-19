package com.icu.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.icu.config.MongoDBConnection;
import com.icu.util.JsonUtil;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.bson.types.ObjectId;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class AlertServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> alerts = db.getCollection("alerts");

        List<Document> list = alerts.find().into(new ArrayList<>());
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(list));
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> alerts = db.getCollection("alerts");

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

        if (json == null || !json.has("id")) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Missing alert id");
            return;
        }

        String id = json.get("id").getAsString();
        if (id == null || id.isBlank()) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid alert id");
            return;
        }

        try {
            alerts.updateOne(
                    Filters.eq("_id", new ObjectId(id)),
                    new Document("$set", new Document("status", "Resolved"))
            );
        } catch (IllegalArgumentException e) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid alert id format");
            return;
        }

        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\":\"Alert resolved successfully\"}");
    }
}