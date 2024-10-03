import { Router } from "express";
import { startBrowser, getBrowser } from "@managers/browser-manager";

const router = Router();

router.get("/", async (req, res) => {
  try {
    console.log('Checking if the browser has already been used');
    if (getBrowser()) {
      const response = "Browser is already used";
      console.log(response);
      return res.status(423).send(response);
    }
    await startBrowser();
    
    res.send("Browser started");
  } catch (error) {
    const response = "Error while staring browser ";
    console.error(response + error);
    return res.status(500).send(response);
  }
});

export default router;
