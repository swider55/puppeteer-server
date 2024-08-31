import { Router } from "express";
import { getBrowser } from "@managers/browser-manager";

const router = Router();

router.delete("/", async (req, res) => {
  try {
    const browser = getBrowser();
    if (!browser) return res.status(400).send("No browser run");

    browser?.close;
    return res.send("Browser closed");
  } catch (error) {
    const response = "Error while closing the browser. ";
    console.error(response + error);
    return res.status(500).send(response);
  }
});

export default router;
