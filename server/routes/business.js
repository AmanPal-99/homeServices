import express from "express";
import Business from "../utils/bSchema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const businesses = await Business.find(
      {},
      "name imageUrl category address email"
    );
   
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const business = await Business.findById(id);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
  
      res.json(business);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

export default router;
