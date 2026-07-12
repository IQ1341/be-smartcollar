import notificationService from "./notification.service.js";

export const sendWhatsApp = async (req, res, next) => {
  try {
    const { phone, message, template } = req.body;
    const result = await notificationService.sendWhatsApp(phone, message, { template });

    return res.status(200).json({ success: true, message: "Pesan terkirim", data: result });
  } catch (err) {
    next(err);
  }
};

export default {
  sendWhatsApp,
};
