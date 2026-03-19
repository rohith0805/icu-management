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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PatientServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> patients = db.getCollection("patients");

        List<Document> list = patients.find().into(new ArrayList<>());
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(list));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> patients = db.getCollection("patients");
        MongoCollection<Document> alerts = db.getCollection("alerts");

        String body = JsonUtil.readBody(req);
        if (body == null || body.isBlank()) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Request body is empty");
            return;
        }

        JsonObject json = null;
        try {
            json = gson.fromJson(body, JsonObject.class);
        } catch (Exception e) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid JSON");
            return;
        }

        if (json == null || !json.has("name") || !json.has("age") || !json.has("gender") || !json.has("diagnosis") || !json.has("heartRate") || !json.has("oxygen") || !json.has("temperature") || !json.has("status") || !json.has("hospitalId") || !json.has("bedNumber")) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Missing required fields for patient creation");
            return;
        }

        String name = json.get("name").getAsString();
        int age = json.get("age").getAsInt();
        String gender = json.get("gender").getAsString();
        String diagnosis = json.get("diagnosis").getAsString();
        int heartRate = json.get("heartRate").getAsInt();
        int oxygen = json.get("oxygen").getAsInt();
        int temperature = json.get("temperature").getAsInt();
        String status = json.get("status").getAsString();
        String hospitalId = json.get("hospitalId").getAsString();
        String bedNumber = json.get("bedNumber").getAsString();

        Document patient = new Document("name", name)
                .append("age", age)
                .append("gender", gender)
                .append("diagnosis", diagnosis)
                .append("heartRate", heartRate)
                .append("oxygen", oxygen)
                .append("temperature", temperature)
                .append("status", status)
                .append("hospitalId", hospitalId)
                .append("bedNumber", bedNumber)
                .append("createdAt", LocalDateTime.now().toString());

        patients.insertOne(patient);

        if (heartRate > 120 || oxygen < 90 || temperature > 39) {
            String message = "Critical vitals for patient " + name;

            Document alert = new Document("patientName", name)
                    .append("message", message)
                    .append("severity", "High")
                    .append("status", "Active")
                    .append("createdAt", LocalDateTime.now().toString());

            alerts.insertOne(alert);
        }

        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\":\"Patient added successfully\"}");
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> patients = db.getCollection("patients");
        MongoCollection<Document> alerts = db.getCollection("alerts");

        String body = JsonUtil.readBody(req);
        if (body == null || body.isBlank()) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Request body is empty");
            return;
        }

        JsonObject json = null;
        try {
            json = gson.fromJson(body, JsonObject.class);
        } catch (Exception e) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid JSON");
            return;
        }

        if (json == null || !json.has("id") || !json.has("heartRate") || !json.has("oxygen") || !json.has("temperature")) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Missing required fields for patient update");
            return;
        }

        String id = json.get("id").getAsString();
        int heartRate = json.get("heartRate").getAsInt();
        int oxygen = json.get("oxygen").getAsInt();
        int temperature = json.get("temperature").getAsInt();

        if (id == null || id.isBlank()) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Patient id is required");
            return;
        }

        String status = "Stable";
        if (heartRate > 120 || oxygen < 90 || temperature > 39) {
            status = "Critical";
        }

        patients.updateOne(
                Filters.eq("_id", new ObjectId(id)),
                new Document("$set", new Document("heartRate", heartRate)
                        .append("oxygen", oxygen)
                        .append("temperature", temperature)
                        .append("status", status))
        );

        if ("Critical".equals(status)) {
            Document patient = patients.find(Filters.eq("_id", new ObjectId(id))).first();
            if (patient != null) {
                Document alert = new Document("patientName", patient.getString("name"))
                        .append("message", "Critical vitals detected")
                        .append("severity", "High")
                        .append("status", "Active")
                        .append("createdAt", LocalDateTime.now().toString());
                alerts.insertOne(alert);
            }
        }

        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\":\"Vitals updated successfully\"}");
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String id = req.getParameter("id");

        if (id == null || id.isBlank()) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Patient id is required");
            return;
        }

        MongoDatabase db = MongoDBConnection.getDatabase();
        MongoCollection<Document> patients = db.getCollection("patients");

        try {
            patients.deleteOne(Filters.eq("_id", new ObjectId(id)));
            resp.setContentType("application/json");
            resp.getWriter().write("{\"message\":\"Patient deleted successfully\"}");
        } catch (IllegalArgumentException e) {
            JsonUtil.sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid patient id format");
        }
    }
}