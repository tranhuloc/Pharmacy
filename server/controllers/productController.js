const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");
const Subcategory = require("../models/subcategoryModel");
const Image = require("../models/imageProductModel");
const Category = require("../models/categoryModel");
const Favorite = require("../models/favoriteModel");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/product");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $match: { is_deleted: false },
            },
            {
                $lookup: {
                    from: "pharmacies",
                    localField: "pharmacy_id",
                    foreignField: "_id",
                    as: "pharmacy",
                },
            },
            {
                $unwind: "$pharmacy",
            },
            {
                $lookup: {
                    from: "suppliers",
                    localField: "supplier_id",
                    foreignField: "_id",
                    as: "supplier",
                },
            },
            {
                $unwind: "$supplier",
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subcategory_id",
                    foreignField: "_id",
                    as: "subcategory",
                },
            },
            {
                $unwind: "$subcategory",
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "subcategory.category_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: "$category",
            },
            {
                $project: {
                    _id: "$_id",
                    product_name: "$product_name",
                    trademark: "$trademark",
                    price: "$price",
                    description: "$description",
                    url_image: "$url_image",
                    pharmacy_name: "$pharmacy.pharmacy_name",
                    category_name: "$category.category_name",
                    subcategory_name: "$subcategory.subcategory_name",
                    supplier_name: "$supplier.supplier_name",
                    active_ingredient: "$active_ingredient",
                    indications: "$indications",
                    dosage_form: "$dosage_form",
                    manufacturer: "$manufacturer",
                    packaging: "$packaging",
                    note: "$note",
                    url_image: "$url_image",
                    stock_quantity: "$stock_quantity",
                    created_at: "$created_at",
                },
            },
        ]);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách sản phẩm",
            error: error.message,
        });
    }
};

// Lấy thông tin sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.product_id);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Sản phẩm không tồn tại" });
        }
        const images = await Image.find({
            product_id: product._id,
            is_deleted: false,
        });
        // Sử dụng aggregate để nối thông tin sản phẩm, subcategory, và category
        const productWithDetails = await Product.aggregate([
            {
                $match: { _id: product._id, is_deleted: false },
            },
            {
                $lookup: {
                    from: "pharmacies",
                    localField: "pharmacy_id",
                    foreignField: "_id",
                    as: "pharmacy",
                },
            },
            {
                $unwind: "$pharmacy",
            },
            {
                $lookup: {
                    from: "suppliers",
                    localField: "supplier_id",
                    foreignField: "_id",
                    as: "supplier",
                },
            },
            {
                $unwind: "$supplier",
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subcategory_id",
                    foreignField: "_id",
                    as: "subcategory",
                },
            },
            {
                $unwind: "$subcategory",
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "subcategory.category_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: "$category",
            },
            {
                $project: {
                    _id: "$_id",
                    product_name: "$product_name",
                    trademark: "$trademark",
                    price: "$price",
                    description: "$description",
                    url_image: "$url_image",
                    category_name: "$category.category_name",
                    pharmacy_name: "$pharmacy.pharmacy_name",
                    pharmacy_id: "$pharmacy._id",
                    subcategory_name: "$subcategory.subcategory_name",
                    subcategory_id: "$subcategory._id",
                    supplier_name: "$supplier.supplier_name",
                    supplier_id: "$supplier._id",
                    active_ingredient: "$active_ingredient",
                    indications: "$indications",
                    dosage_form: "$dosage_form",
                    manufacturer: "$manufacturer",
                    packaging: "$packaging",
                    note: "$note",
                    url_image: "$url_image",
                    stock_quantity: "$stock_quantity",
                    created_at: "$created_at",
                },
            },
        ]);

        if (productWithDetails.length > 0) {
            productWithDetails[0].images = images;
            res.status(200).json({
                success: true,
                data: productWithDetails[0],
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Không thể tìm thấy thông tin sản phẩm",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy thông tin sản phẩm",
            error: error.message,
        });
    }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        upload.array("images", 5)(req, res, async err => {
            if (err) {
                // Xử lý lỗi nếu có
                return res.status(500).json({
                    success: false,
                    message: "Lỗi khi xử lý tệp tải lên",
                });
            }

            const product_name = req.body.product_name;
            const trademark = req.body.trademark;
            const price = req.body.price;
            const description = req.body.description;
            const subcategory_id = req.body.subcategory_id;
            const pharmacy_id = req.body.pharmacy_id;
            const supplier_id = req.body.supplier_id;
            const stock_quantity = req.body.stock_quantity;
            const active_ingredient = req.body.active_ingredient;
            const indications = req.body.indications;
            const dosage_form = req.body.dosage_form;
            const manufacturer = req.body.manufacturer;
            const packaging = req.body.packaging;
            const note = req.body.note;
            const imageUrls = req.files.map(file => file.filename);
            const url_image = `/images/product/${imageUrls[0]}`;

            // Kiểm tra xem có sản phẩm nào đã bị xóa không
            const existingProduct = await Product.findOne({ product_name });

            if (existingProduct) {
                if (existingProduct.is_deleted) {
                    // Cập nhật thông tin sản phẩm và đánh dấu là không xóa
                    existingProduct.price = price;
                    existingProduct.trademark = trademark;
                    existingProduct.description = description;
                    existingProduct.pharmacy_id = pharmacy_id;
                    existingProduct.subcategory_id = subcategory_id;
                    existingProduct.supplier_id = supplier_id;
                    existingProduct.stock_quantity = stock_quantity;
                    existingProduct.url_image = url_image;
                    existingProduct.active_ingredient = active_ingredient;
                    existingProduct.indications = indications;
                    existingProduct.dosage_form = dosage_form;
                    existingProduct.manufacturer = manufacturer;
                    existingProduct.packaging = packaging;
                    existingProduct.note = note;
                    existingProduct.is_deleted = false;
                    existingProduct.updated_at = Date.now();

                    await existingProduct.save();

                    // Lưu các hình ảnh vào bảng Image
                    for (const imageUrl of imageUrls) {
                        const imageProduct = new Image({
                            product_id: existingProduct._id,
                            image_url: `/images/product/${imageUrl}`,
                            is_deleted: false,
                            created_at: Date.now(),
                            updated_at: Date.now(),
                        });
                        await imageProduct.save();
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Sản phẩm đã được khôi phục thành công",
                    });
                } else {
                    return res.status(409).json({
                        success: false,
                        message: "Sản phẩm đã tồn tại!",
                    });
                }
            }

            // Nếu không có sản phẩm đã bị xóa, tiếp tục tạo sản phẩm mới
            const newProduct = new Product({
                product_name,
                trademark,
                price,
                description,
                pharmacy_id,
                subcategory_id,
                supplier_id,
                stock_quantity,
                url_image,
                is_deleted: false,
                active_ingredient,
                indications,
                dosage_form,
                manufacturer,
                packaging,
                note,
                created_at: Date.now(),
                updated_at: Date.now(),
            });

            const product = await newProduct.save();

            // Lưu các hình ảnh vào bảng Image
            for (const imageUrl of imageUrls) {
                const imageProduct = new Image({
                    product_id: product._id,
                    image_url: `/images/product/${imageUrl}`,
                    is_deleted: false,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                });
                await imageProduct.save();
            }

            return res.status(200).json({
                success: true,
                message: "Sản phẩm đã được tạo thành công",
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi tạo sản phẩm",
            error: error.message,
        });
    }
};

// Cập nhật sản phẩm theo ID
exports.editProduct = async (req, res) => {
    try {
        upload.array("images", 5)(req, res, async err => {
            if (err) {
                // Xử lý lỗi nếu có
                return res.status(500).json({
                    success: false,
                    message: "Lỗi khi xử lý tệp tải lên",
                });
            }
            const product_id = req.params.product_id;
            const product_name = req.body.product_name;
            const trademark = req.body.trademark;
            const price = req.body.price;
            const description = req.body.description;
            const pharmacy_id = req.body.pharmacy_id;
            const subcategory_id = req.body.subcategory_id;
            const supplier_id = req.body.supplier_id;
            const stock_quantity = req.body.stock_quantity;
            const active_ingredient = req.body.active_ingredient;
            const indications = req.body.indications;
            const dosage_form = req.body.dosage_form;
            const manufacturer = req.body.manufacturer;
            const packaging = req.body.packaging;
            const note = req.body.note;

            if (req.files && req.files.length > 0) {
                const imageUrls = req.files.map(file => file.filename);
                // Thêm hình ảnh mới của sản phẩm
                for (const imageUrl of imageUrls) {
                    const imageProduct = new Image({
                        product_id: product_id,
                        image_url: `/images/product/${imageUrl}`,
                        is_deleted: false,
                        created_at: Date.now(),
                        updated_at: Date.now(),
                    });
                    await imageProduct.save();
                }

                const imageUrlsToDelete = await Image.find({
                    product_id: product_id,
                    is_deleted: false,
                });

                // Cập nhật thông tin sản phẩm
                await Product.findByIdAndUpdate(product_id, {
                    product_name,
                    trademark,
                    price,
                    description,
                    pharmacy_id,
                    subcategory_id,
                    supplier_id,
                    stock_quantity,
                    url_image: imageUrlsToDelete[0].image_url,
                    active_ingredient,
                    indications,
                    dosage_form,
                    manufacturer,
                    packaging,
                    note,
                    updated_at: Date.now(),
                });
            } else {
                // Cập nhật thông tin sản phẩm
                await Product.findByIdAndUpdate(product_id, {
                    product_name,
                    trademark,
                    price,
                    description,
                    pharmacy_id,
                    subcategory_id,
                    supplier_id,
                    stock_quantity,
                    active_ingredient,
                    indications,
                    dosage_form,
                    manufacturer,
                    packaging,
                    note,
                    updated_at: Date.now(),
                });
            }

            return res.status(200).json({
                success: true,
                message: "Sản phẩm đã được cập nhật thành công",
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi chỉnh sửa sản phẩm",
            error: error.message,
        });
    }
};

// Xóa sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
    try {
        const product_id = req.params.product_id;

        // Xóa sản phẩm
        const product = await Product.findOneAndUpdate(
            { _id: product_id },
            { is_deleted: true, updated_at: Date.now() }
        );

        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Sản phẩm không tồn tại" });
        }
        return res.status(200).json({
            success: true,
            message: "Sản phẩm đã được xóa thành công",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi xóa sản phẩm",
            error: error.message,
        });
    }
};

// Lấy tất cả sản phẩm theo subcategory_id
exports.getProductsBySubcategory = async (req, res) => {
    try {
        const subcategory_name = req.params.subcategory_name;
        const subcategory = await Subcategory.findOne({
            subcategory_name,
            is_deleted: false,
        });
        const orderBy = req.params.orderby;

        let sortOptions = {};

        if (orderBy === "manual") {
            sortOptions = { created_at: -1 };
        } else if (orderBy === "price-ascending") {
            sortOptions = { price: 1 };
        } else if (orderBy === "price-descending") {
            sortOptions = { price: -1 };
        } else if (orderBy === "title-ascending") {
            sortOptions = { product_name: 1 };
        } else if (orderBy === "title-descending") {
            sortOptions = { product_name: -1 };
        }

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: "Danh mục con không tồn tại",
            });
        }
        const products = await Product.find({
            subcategory_id: subcategory._id,
            is_deleted: false,
        }).sort(sortOptions);
        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách sản phẩm theo subcategory_id",
            error: error.message,
        });
    }
};

// Lấy tất cả sản phẩm theo category_id
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const orderBy = req.params.orderby;

        let sortOptions = {};

        if (orderBy === "manual") {
            sortOptions = { _id: -1 };
        } else if (orderBy === "price-ascending") {
            sortOptions = { price: 1 };
        } else if (orderBy === "price-descending") {
            sortOptions = { price: -1 };
        } else if (orderBy === "title-ascending") {
            sortOptions = { product_name: 1 };
        } else if (orderBy === "title-descending") {
            sortOptions = { product_name: -1 };
        }
        const category = await Category.findOne({
            product_name: categoryName,
            is_deleted: false,
        });

        if (!category) {
            return res
                .status(404)
                .json({ success: false, message: "Danh mục không tồn tại" });
        }

        // Lấy tất cả subcategory_id thuộc category_id
        const subcategories = await Subcategory.find({
            category_id: category._id,
            is_deleted: false,
        });

        const subcategoryIds = subcategories.map(
            subcategory => subcategory._id
        );

        // Lấy tất cả sản phẩm thuộc các subcategory_id đã tìm được
        const products = await Product.find({
            subcategory_id: { $in: subcategoryIds },
            is_deleted: false,
        }).sort(sortOptions);

        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách sản phẩm theo category_id",
            error: error.message,
        });
    }
};

exports.getNewestProducts = async (req, res) => {
    try {
        const newestProducts = await Product.find({ is_deleted: false })
            .sort({ _id: -1 })
            .limit(8);

        return res.status(200).json({ success: true, data: newestProducts });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy sản phẩm mới nhất",
            error: error.message,
        });
    }
};

exports.search = async (req, res) => {
    const keyword = req.params.keyword;

    try {
        const results = await Product.find({
            product_name: { $regex: new RegExp(keyword, "i") },
            is_deleted: false,
        });

        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi tìm kiếm sản phẩm",
            error: error.message,
        });
    }
};

exports.checkUserHasPurchased = async (req, res) => {
    try {
        const { userId, product_id } = req.params;

        const orderItems = await OrderItem.find({
            product_id: product_id,
            is_deleted: false,
        });

        // Extract order_ids from the found orderItems
        const orderIds = orderItems.map(orderItem => orderItem.order_id);

        // Fetch associated Order documents
        const orders = await Order.find({
            _id: { $in: orderIds },
            is_deleted: false,
        });

        // Check if there's an order with the specified user_id
        const userHasPurchased = orders.some(order => order.user_id == userId);

        if (userHasPurchased) {
            return res.status(200).json({ success: true, message: "Success" });
        } else {
            return res.status(200).json({ success: true, message: "Null" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Lỗi", error: error.message });
    }
};

exports.isProductFavorite = async (req, res) => {
    try {
        const { userId, product_id } = req.params;

        const favorite = await Favorite.find({
            product_id: product_id,
            user_id: userId,
            is_deleted: false,
        });

        if (favorite.length != 0) {
            return res.status(200).json({ success: true, message: "Success" });
        } else {
            return res.status(200).json({ success: true, message: "Null" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Lỗi", error: error.message });
    }
};

exports.CheckProductAvailability = async (req, res) => {
    const dataOrderDetail = req.body;

    try {
        const response = await Promise.all(dataOrderDetail.map(async (item) => {
            const product = await Product.findById(item.product_id);

            if (product) {
                return {
                    product_id: item.product_id,
                    product_name: product.product_name,
                    quantity: product.stock_quantity,
                    available: product.stock_quantity >= item.quantity
                };
            } else {
                return {
                    product_id: item.product_id,
                    product_name: item.product_name,
                    message: `Sản phẩm [${item.product_name}] không tồn tại`,
                };
            }
        }));

        return res.status(200).json({ success: true, message: "Success", data: response });
    } catch (error) {
        console.error(`Error checking product availability: ${error.message}`);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};