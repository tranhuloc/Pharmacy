// routes/record.js
const express = require('express');
const passport = require("passport");

const router = express.Router();
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');
const categoryController = require('../controllers/categoryController');
const supplierController = require('../controllers/supplierController');
const imageProductController = require('../controllers/imageProductController');
const orderController = require('../controllers/orderController');
const orderItemController = require('../controllers/orderItemController');
const productController = require('../controllers/productController');
const pharmacyController = require('../controllers/pharmacyController');
const subcategoryController = require('../controllers/subCategoryController');
const ratingController = require('../controllers/ratingController');
const revenueController = require('../controllers/revenuesController');
const favoriteController = require('../controllers/favoriteController');

const User = require('../models/userModel');
const Role = require('../models/roleModel');

// Routes for 'favorites'
router.get('/favorites/:user_id', favoriteController.getAllFavorites);
router.post('/favorites', favoriteController.addOrUpdateFavorite);
router.delete('/favorites/:user_id/:product_id', favoriteController.deleteFavorite);

// Routes for 'roles'
router.get('/roles', roleController.getRoles);

// Routes for 'users'
router.post('/users', userController.addUser);
router.post('/users/login', userController.login);
router.get('/users', userController.getAllUsers);
router.get('/users/:user_id', userController.getUserById);
router.put('/users/:user_id', userController.editUser);
router.delete('/users/:user_id', userController.deleteUser);
router.get('/users/check_username/:username', userController.checkUserName);
router.put('/users/update_password/reset', userController.updatePassword);
router.post('/users/send_email', userController.sendEmail);

// Routes for 'categories'
router.get('/categories', categoryController.getAllCategories);
router.post('/categories', categoryController.addCategory);
router.get('/categories/:category_id', categoryController.getCategoryById);
router.put('/categories/:category_id', categoryController.editCategory);
router.delete('/categories/:category_id', categoryController.deleteCategory);

// Routes for 'suppliers'
router.get('/suppliers', supplierController.getAllSuppliers);
router.post('/suppliers', supplierController.addSupplier);
router.get('/suppliers/:supplier_id', supplierController.getSupplierById);
router.put('/suppliers/:supplier_id', supplierController.editSupplier);
router.delete('/suppliers/:supplier_id', supplierController.deleteSupplier);

// Routes for 'imageProduct'
router.get('/products/:product_id/images', imageProductController.getImagesByProductId);
router.delete('/images/:imageId', imageProductController.deleteImages);

// Routes for 'orders'
router.get('/orders/:status', orderController.getAllOrders);
router.get('/orders/:order_id', orderController.getOrderById);
router.post('/orders', orderController.createOrder);
router.put('/orders/:order_id', orderController.editOrder);
router.delete('/orders/:order_id', orderController.deleteOrder);
router.get('/users/:user_id/orders', orderController.getOrdersByUserId);
router.put('/orders/:order_id/:newStatus', orderController.changeStatusOrder);

// Routes for 'orderItem'
router.get('/orders/:order_id/items', orderItemController.getOrderItemsByOrderId);

// Routes for 'product'
router.get('/products', productController.getAllProducts);
router.get('/products/:product_id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:product_id', productController.editProduct);
router.delete('/products/:product_id', productController.deleteProduct);
router.get('/subcategories/:subcategory_name/:orderby/products', productController.getProductsBySubcategory);
router.get('/categories/:categoryName/:orderby/products', productController.getProductsByCategory);
router.get('/newest-products', productController.getNewestProducts);
router.get('/search/:keyword', productController.search);
router.get('/products/:user_id/:product_id', productController.checkUserHasPurchased);
router.get('/products/:user_id/:product_id/favorite', productController.isProductFavorite);

// Routes for 'Pharmacy'
router.get('/pharmacies', pharmacyController.getAllPharmacies);
router.post('/pharmacies', pharmacyController.addPharmacy);
router.get('/pharmacies/:pharmacy_id', pharmacyController.getPharmacyById);
router.put('/pharmacies/:pharmacy_id', pharmacyController.editPharmacy);
router.delete('/pharmacies/:pharmacy_id', pharmacyController.deletePharmacy);

// Route for getting subcategories by category_id
router.get('/categories-with-subcategories', subcategoryController.getAllCategoriesWithSubcategories);
router.get('/subcategories', subcategoryController.getSubCategories);
router.get('/subcategories/:category_id', subcategoryController.getSubcategoriesByCategory);
router.post('/subcategories', subcategoryController.addSubCategory);
router.get('/subcategories/getById/:subcategory_id', subcategoryController.getSubCategoryById);
router.put('/subcategories/:subcategory_id', subcategoryController.editSubCategory);
router.delete('/subcategories/:subcategory_id', subcategoryController.deleteSubCategory);

// Routes for 'Rating'
router.post('/ratings', ratingController.addRating);
router.get('/ratings/:product_id', ratingController.getRatingByProductId);
router.get('/ratings/getByUser_Product/:user_id/:product_id', ratingController.getAllRating);
router.delete('/ratings/:RatingId', ratingController.deleteRating);

// Routes for 'revenues'
router.post('/revenues/get-revenue', revenueController.getRevenue);

//auth

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
        try {
            const user = req.user;
            const existingUser1 = await User.findOne({ email: user.emails[0].value }).populate('idRole');
  
            if (!existingUser1) {
                const defaultRole = await Role.findOne({ roleName: 'user' });
  
                if (defaultRole) {
                    userRole = defaultRole._id;
                }
  
                const newUser = new User({
                    firstname: user.name.givenName,
                    lastname: user.name.familyName,
                    username: user.emails[0].value,
                    password: '',
                    phone: '',
                    email: user.emails[0].value,
                    address: '',
                    idRole: userRole,
                });
  
                await newUser.save();

                res.redirect(`http://localhost:3000/auth/callback?id=${newUser._id}&firstname=${newUser.firstname}&lastname=${newUser.lastname}&email=${newUser.email}&phone=${newUser.phone}&address=${newUser.address}&role=user`);
            } else {
                res.redirect(`http://localhost:3000/auth/callback?id=${existingUser1._id}&firstname=${existingUser1.firstname}&lastname=${existingUser1.lastname}&email=${existingUser1.email}&phone=${existingUser1.phone}&address=${existingUser1.address}&role=${existingUser1.idRole.roleName}`);
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
  );
  
module.exports = router;
