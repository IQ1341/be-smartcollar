import notificationService from "./notification.service.js";

export const sendTestWhatsApp = async (req, res, next) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: "phone dan message wajib diisi untuk testing",
      });
    }

    const result = await notificationService.sendWhatsApp(phone, message);

    return res.status(200).json({
      success: true,
      message: "Test pesan WhatsApp terkirim",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  sendTestWhatsApp,
};
