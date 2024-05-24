const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require('./routes/record');
const nodemailer = require('nodemailer');
const path = require('path');
const { connectDB } = require('./db/conn');
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportStrategy = require("./auth/passport");

dotenv.config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 5000;

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Cấu hình để phục vụ tài nguyên tĩnh từ thư mục /public
app.use(express.static(path.resolve('./public')));

// Kết nối đến cơ sở dữ liệu MongoDB
connectDB()
  .then(() => {
    // Kết nối thành công, tiếp tục khởi động máy chủ
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    // Kết nối thất bại, không khởi động máy chủ
    console.error("Không thể khởi động máy chủ:", error);
  });

app.use('/api', routes);
