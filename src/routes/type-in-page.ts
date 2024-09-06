import { Router } from "express";
import { getPage } from "@managers/browser-manager";

const router = Router();

router.put("/", async (req, res) => {
  try {
    const { pageId, text, selector } = req.body;
    const page = getPage(pageId);

    if (!page) return res.status(400).send("Page not found");

    await page.type(selector, text, {delay: 100})

    return res.send("Text entered");
  } catch (error) {
    const response = "Error while typing ";
    console.error(response + error);
    return res.status(500).send(response);
  }
});

export default router;
