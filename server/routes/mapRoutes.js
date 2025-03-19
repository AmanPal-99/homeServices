import express from "express";
import { getRoute } from "../utils/mapController.js";

const router = express.Router();

router.get("/route/:userId/:businessId", getRoute);

export default router;
