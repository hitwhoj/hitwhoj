const crypto = require("crypto");

// 生成一个随机的256位密钥和128位初始化向量（IV）
const key = crypto.randomBytes(32); // 256位密钥
const iv = crypto.randomBytes(16); // 128位初始化向量

// 加密函数
function encrypt(text, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

const originalPassword = "LBnTmBcuUaicsUMD";

// 使用上面的密钥和IV来加密密码
const encryptedPassword = encrypt(originalPassword, key, iv);

// 输出加密后的密码、密钥和IV
console.log(`Encrypted Password: ${encryptedPassword}`);
console.log(`Key: ${key.toString("hex")}`);
console.log(`IV: ${iv.toString("hex")}`);
