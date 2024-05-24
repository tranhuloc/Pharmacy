const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect('mongodb://0.0.0.0:27017/SolesDatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Kết nối cơ sở dữ liệu thành công");
    return connection.connection.db;
  } catch (error) {
    console.error("Lỗi kết nối cơ sở dữ liệu:", error);
    throw error;
  }
};

module.exports = {
  async up(db) {
    const database = await connectDB();

    const rolesCollection = database.collection("roles");
    const usersCollection = database.collection("users");
    const categorysCollection = database.collection("categories");
    const subcategorysCollection = database.collection("subcategories");
    const productsCollection = database.collection("products");
    const imagesCollection = database.collection("images");
    const sizesCollection = database.collection("sizes");
    const colorsCollection = database.collection("colors");
    const productsizecolorsCollection = database.collection("productsizecolors");

    await rolesCollection.insertMany([
      {
        roleName: "admin",
      },
      {
        roleName: "user",
      }
    ]);

    const adminRole = await rolesCollection.findOne({ roleName: "admin" });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('12345678', saltRounds);

    await usersCollection.insertOne({
      firstname: 'Nguyễn',
      lastname: 'Nhựt',
      username: 'admin',
      password: hashedPassword,
      phone: '0778905454',
      email: 'nhut@gmail.com',
      address: 'Cần Thơ',
      idRole: adminRole._id,
    });

    await categorysCollection.insertMany([
      {
        name: 'Giày Dép'
      },
      {
        name: 'Quần Áo'
      },
      {
        name: 'Dụng Cụ'
      },
      {
        name: 'Phụ Kiện'
      }
    ]);

    const catGiayDep = await categorysCollection.findOne({ name: "Giày Dép" });
    const catQuanAo = await categorysCollection.findOne({ name: "Quần Áo" });
    const catDungCu = await categorysCollection.findOne({ name: "Dụng Cụ" });
    const catPhuKien = await categorysCollection.findOne({ name: "Phụ Kiện" });

    await subcategorysCollection.insertMany([
      {
        category_id: catGiayDep._id,
        name: 'Giày Thời Trang'
      }, {
        category_id: catGiayDep._id,
        name: 'Giày Chạy Bộ'
      }, {
        category_id: catGiayDep._id,
        name: 'Xăn đan & Dép'
      }, {
        category_id: catGiayDep._id,
        name: 'Giày Luyện Tập'
      }, {
        category_id: catGiayDep._id,
        name: 'Giày Bóng Rổ'
      }, {
        category_id: catGiayDep._id,
        name: 'Giày Bóng Đá'
      }, {
        category_id: catQuanAo._id,
        name: 'Áo Ba Lổ & Áo Thun'
      }, {
        category_id: catQuanAo._id,
        name: 'Áo Khoác'
      }, {
        category_id: catQuanAo._id,
        name: 'Áo Polo'
      }, {
        category_id: catQuanAo._id,
        name: 'Áo tập'
      }, {
        category_id: catQuanAo._id,
        name: 'Áo Chui Đầu & Áo Nỉ'
      }, {
        category_id: catQuanAo._id,
        name: 'Đồ Bơi'
      }, {
        category_id: catQuanAo._id,
        name: 'Đồ Lót'
      }, {
        category_id: catQuanAo._id,
        name: 'Đồ Bóng Rổ'
      }, {
        category_id: catQuanAo._id,
        name: 'Đồ Bóng Đá'
      }, {
        category_id: catDungCu._id,
        name: 'Bóng Đá'
      }, {
        category_id: catDungCu._id,
        name: 'Bóng Rổ'
      }, {
        category_id: catDungCu._id,
        name: 'Đồ Bảo Hộ'
      }, {
        category_id: catDungCu._id,
        name: 'Đồ Luyện Tập'
      }, {
        category_id: catDungCu._id,
        name: 'Gold'
      }, {
        category_id: catDungCu._id,
        name: 'Yoga'
      }, {
        category_id: catPhuKien._id,
        name: 'Túi & Balo'
      }, {
        category_id: catPhuKien._id,
        name: 'Mũ Nón'
      }, {
        category_id: catPhuKien._id,
        name: 'Phụ Kiện Bơi Lội'
      }, {
        category_id: catPhuKien._id,
        name: 'Vớ'
      }, {
        category_id: catPhuKien._id,
        name: 'Bình Nước'
      }, {
        category_id: catPhuKien._id,
        name: 'Găng Tay'
      }, {
        category_id: catPhuKien._id,
        name: 'Bộ Chăm Sóc Giày'
      }, {
        category_id: catPhuKien._id,
        name: 'Khăn Tập'
      }
    ]);

    const subcatGiayDep = await subcategorysCollection.findOne({ name: "Giày Thời Trang" });

    await productsCollection.insertMany([
      {
        subcategory_id: subcatGiayDep._id,
        name: 'Giày Thể Thao Nữ New Balance 574 Classic Wl574Evg Lifestyle',
        price: 2559000,
        description: '574 không chỉ là một đôi giày. Với những đường nét gọn gàng, phối màu độc đáo và kiểu dáng cổ điển và được làm từ chất liệu cải tiến, đôi giày sneaker này là biểu tượng của sự khéo léo và độc đáo - bất kể bạn phối hợp nó với bất kỳ phong cách nào.',
        url_image1: '/images/product/imageProduct_1.webp',
        url_image2: '/images/product/imageProduct_2.webp'
      }
    ]);

    const product = await productsCollection.findOne({ name: "Giày Thể Thao Nữ New Balance 574 Classic Wl574Evg Lifestyle" });

    await imagesCollection.insertMany([
      {
        product_id: product._id,
        image_url: '/images/product/imageProduct_1.webp',
      },
      {
        product_id: product._id,
        image_url: '/images/product/imageProduct_2.webp',
      },
      {
        product_id: product._id,
        image_url: '/images/product/imageProduct_3.webp',
      },
      {
        product_id: product._id,
        image_url: '/images/product/imageProduct_4.webp',
      },
      {
        product_id: product._id,
        image_url: '/images/product/imageProduct_5.webp',
      },
      {
        product_id: product._id,
        image_url: '/images/product/imageProduct_6.webp',
      },
      {
        product_id: product._id,
        image_url: '/images/product/imageProduct_7.webp',
      },
      {
        product_id: product._id,
        image_url: '/images/product/imageProduct_8.webp',
      },
      {
        product_id: product._id,
        image_url: '/images/product/imageProduct_9.webp',
      }
    ]);

    await colorsCollection.insertMany([
      {
        color_name: "Đỏ",
        is_delete: 0
      }, {
        color_name: "Trắng",
        is_delete: 0
      }, {
        color_name: "Đen",
        is_delete: 0
      }, {
        color_name: "Xanh",
        is_delete: 0
      }, {
        color_name: "Vàng",
        is_delete: 0
      }, {
        color_name: "Hồng",
        is_delete: 0
      },
    ]);

    await sizesCollection.insertMany([
      {
        size_name: "NO SIZE",
        is_delete: 0
      },
      {
        size_name: "M",
        is_delete: 0
      },
      {
        size_name: "L",
        is_delete: 0
      },
      {
        size_name: "XL",
        is_delete: 0
      },
      {
        size_name: "XXL",
        is_delete: 0
      },
      {
        size_name: "37",
        is_delete: 0
      },
      {
        size_name: "38",
        is_delete: 0
      },
      {
        size_name: "39",
        is_delete: 0
      },
      {
        size_name: "40",
        is_delete: 0
      },
      {
        size_name: "41",
        is_delete: 0
      },
      {
        size_name: "42",
        is_delete: 0
      },
      {
        size_name: "43",
        is_delete: 0
      },
      {
        size_name: "44",
        is_delete: 0
      }
    ]);

    const color1 = await colorsCollection.findOne({ color_name: "Đỏ" });
    const size1 = await sizesCollection.findOne({ size_name: "42" });
    const color2 = await colorsCollection.findOne({ color_name: "Đen" });
    const size2 = await sizesCollection.findOne({ size_name: "39" });

    await productsizecolorsCollection.insertMany([
      {
        product_id: product._id,
        size_id: size1._id,
        color_id: color1._id,
        quantity: 100
      }, {
        product_id: product._id,
        size_id: size2._id,
        color_id: color2._id,
        quantity: 100
      },
    ]);
  },

  async down(db) {
    const database = await connectDB();

    const rolesCollection = database.collection("roles");
    const usersCollection = database.collection("users");
    const categorysCollection = database.collection("categorys");
    const subcategorysCollection = database.collection("subcategorys");
    const productsCollection = database.collection("products");
    const imagesCollection = database.collection("images");
    const colorsCollection = database.collection("colors");
    const sizesCollection = database.collection("sizes");
    const productsizecolorsCollection = database.collection("productsizecolors");

    await subcategorysCollection.deleteMany({});

    await categorysCollection.deleteMany({});

    await usersCollection.deleteMany({});

    await rolesCollection.deleteMany({});

    await productsCollection.deleteMany({});

    await imagesCollection.deleteMany({});

    await colorsCollection.deleteMany({});

    await sizesCollection.deleteMany({});

    await productsizecolorsCollection.deleteMany({});

  }
};
