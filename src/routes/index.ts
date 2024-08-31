import { Router } from "express";
import startBrowser from "@routes/start-browser";
import openUrlInNewPage from "@routes/open-url-in-new-page";
import openUrlInExistingPage from "@routes/open-url-in-existing-page";
import getPageContent from "@routes/get-page-content";
import clickElementInPage from "@routes/click-element-in-page";
import closeBrowser from "@routes/close-browser";
import closePage from "@routes/close-page";
import goBackInPage from "@routes/go-back-in-page";

const router = Router();

router.use("/start-browser", startBrowser);
router.use("/open-url-in-new-tab", openUrlInNewPage);
router.use("/go-to-page-in-existing-tab", openUrlInExistingPage);
router.use("/get-page-content", getPageContent);
router.use("/click-element", clickElementInPage);
router.use("/close-browser", closeBrowser);
router.use("/close-tab", closePage);
router.use("/go-back-in-tab", goBackInPage);

export default router;
