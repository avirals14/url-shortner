import UrlModel from "../models/Url.model.js";
import { nanoid } from "nanoid";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "originalUrl is required",
      });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL Format",
      });
    }

    // generate unique short code
    let shortCode;
    let exists = true;

    while (exists) {
      shortCode = nanoid(5);
      const existingUrl = await UrlModel.findOne({ shortCode });
      if (!existingUrl) exists = false;
    }

    // Save to DB
    const url = await UrlModel.create({
      originalUrl: parsedUrl.href,
      shortCode,
    });

    // Build Short URL
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    return res.status(201).json({
      success: true,
      message: "URL created successfully",
      shortCode,
      shortUrl,
      originalUrl: url.originalUrl,
    });
  } catch (error) {
    console.error("Create short URL error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create short URL",
    });
  }
};


export const getOriginalUrl = async (req, res) => {
  try {
    const {shortCode} = req.params;

    // find URL by shortcode
    const url = await UrlModel.findOne({shortCode});

    if(!url){
      return res.status(404).json({
        success:false,
        message:"URL Not Found"
      });
    }

    // Checking expiry
    if(url.expiresAt && url.expiresAt < new Date()){
      return res.status(410).json({
        success:false,
        message:"URL has expired"
      });
    }

    // Increase click count
    await UrlModel.updateOne(
      {_id:url._id}, {$inc:{clicks:1}}
    );

    // redirect to original URL
    return res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error("Redirect error : ", error);
    return res.status(500).json({
      success:true,
      message:"Redirect Failed"
    });
  }
}