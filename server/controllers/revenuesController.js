const OrderItem = require('../models/orderItemModel');

exports.getRevenue = async (req, res) => {
    const data = req.body;

    if (data) {
        try {
            if (data.startDate && data.endDate) {
                const startDate = new Date(data.startDate);
                const endDate = new Date(data.endDate);

                const salesData = await OrderItem.aggregate([
                    {
                        $lookup: {
                            from: 'orders',
                            localField: 'order_id',
                            foreignField: '_id',
                            as: 'order'
                        }
                    },
                    {
                        $unwind: '$order'
                    },
                    {
                        $match: {
                            'order.order_date': { $exists: true },
                            $expr: {
                                $and: [
                                    { $gte: ['$order.order_date', startDate] },
                                    { $lt: ['$order.order_date', endDate] },
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'product_id',
                            foreignField: '_id',
                            as: 'product'
                        }
                    },
                    {
                        $unwind: '$product'
                    },
                    {
                        $group: {
                            _id: '$product_id',
                            productName: { $first: '$product.name' },
                            totalQuantity: { $sum: '$quantity' },
                            totalPrice: { $sum: { $multiply: ['$order.total_price', '$quantity'] } }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            productName: 1,
                            totalQuantity: 1,
                            totalPrice: 1
                        }
                    }
                ]);

                if (salesData.length === 0) {
                    return res.json({ revenue: 0 + ' đồng' });
                }
                const groupedSalesData = salesData.reduce((acc, item) => {
                    const existingItem = acc.find(x => x.product_id === item.product_id);
                    if (existingItem) {
                        existingItem.totalQuantity += item.totalQuantity;
                        existingItem.totalPrice += item.totalPrice;
                    } else {
                        acc.push({
                            product_id: item.product_id,
                            productName: item.productName,
                            totalQuantity: item.totalQuantity,
                            totalPrice: item.totalPrice,
                        });
                    }
                    return acc;
                }, []);

                // Sắp xếp dữ liệu theo tổng số lượng giảm dần
                const sortedSalesData = groupedSalesData.sort((a, b) => b.totalQuantity - a.totalQuantity);

                const totalSales = groupedSalesData.reduce((acc, item) => acc + item.totalPrice, 0);

                const formattedData = new Intl.NumberFormat('vi-VN').format(totalSales) + ' đồng';
                res.json({ revenue: formattedData, salesData: sortedSalesData });
            } else if (data.date) {
                const date = new Date(data.date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;

                const salesData = await OrderItem.aggregate([
                    {
                        $lookup: {
                            from: 'orders',
                            localField: 'order_id',
                            foreignField: '_id',
                            as: 'order'
                        }
                    },
                    {
                        $unwind: '$order'
                    },
                    {
                        $match: {
                            'order.order_date': { $exists: true },
                            $expr: {
                                $and: [
                                    { $eq: [{ $year: { $toDate: '$order.order_date' } }, year] },
                                    { $eq: [{ $month: { $toDate: '$order.order_date' } }, month] },
                                    { $eq: [{ $dayOfMonth: { $toDate: '$order.order_date' } }, date.getDate()] }
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'product_id',
                            foreignField: '_id',
                            as: 'product'
                        }
                    },
                    {
                        $unwind: '$product'
                    },
                    {
                        $group: {
                            _id: '$product_id',
                            productName: { $first: '$product.name' },
                            totalQuantity: { $sum: '$quantity' },
                            totalPrice: { $sum: { $multiply: ['$order.total_price', '$quantity'] } }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            productName: 1,
                            totalQuantity: 1,
                            totalPrice: 1
                        }
                    }
                ]);

                if (salesData.length === 0) {
                    return res.json({ revenue: 0 + ' đồng' });;
                }
                const groupedSalesData = salesData.reduce((acc, item) => {
                    const existingItem = acc.find(x => x.product_id === item.product_id);
                    if (existingItem) {
                        existingItem.totalQuantity += item.totalQuantity;
                        existingItem.totalPrice += item.totalPrice;
                    } else {
                        acc.push({
                            product_id: item.product_id,
                            productName: item.productName,
                            totalQuantity: item.totalQuantity,
                            totalPrice: item.totalPrice,
                        });
                    }
                    return acc;
                }, []);

                // Sắp xếp dữ liệu theo tổng số lượng giảm dần
                const sortedSalesData = groupedSalesData.sort((a, b) => b.totalQuantity - a.totalQuantity);

                const totalSales = groupedSalesData.reduce((acc, item) => acc + item.totalPrice, 0);

                const formattedData = new Intl.NumberFormat('vi-VN').format(totalSales) + ' đồng';
                res.json({ revenue: formattedData, salesData: sortedSalesData });
            } else if (data.month && data.year) {
                const year = parseInt(data.year);
                const month = parseInt(data.month);

                const salesData = await OrderItem.aggregate([
                    {
                        $lookup: {
                            from: 'orders',
                            localField: 'order_id',
                            foreignField: '_id',
                            as: 'order'
                        }
                    },
                    {
                        $unwind: '$order'
                    },
                    {
                        $match: {
                            'order.order_date': { $exists: true },
                            $expr: {
                                $and: [
                                    { $eq: [{ $year: { $toDate: '$order.order_date' } }, year] },
                                    { $eq: [{ $month: { $toDate: '$order.order_date' } }, month] }
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'product_id',
                            foreignField: '_id',
                            as: 'product'
                        }
                    },
                    {
                        $unwind: '$product'
                    },
                    {
                        $group: {
                            _id: '$product_id',
                            productName: { $first: '$product.name' },
                            totalQuantity: { $sum: '$quantity' },
                            totalPrice: { $sum: { $multiply: ['$order.total_price', '$quantity'] } }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            productName: 1,
                            totalQuantity: 1,
                            totalPrice: 1
                        }
                    }
                ]);

                if (salesData.length === 0) {
                    return res.json({ revenue: 0 + ' đồng' });;
                }
                const groupedSalesData = salesData.reduce((acc, item) => {
                    const existingItem = acc.find(x => x.product_id === item.product_id);
                    if (existingItem) {
                        existingItem.totalQuantity += item.totalQuantity;
                        existingItem.totalPrice += item.totalPrice;
                    } else {
                        acc.push({
                            product_id: item.product_id,
                            productName: item.productName,
                            totalQuantity: item.totalQuantity,
                            totalPrice: item.totalPrice,
                        });
                    }
                    return acc;
                }, []);

                // Sắp xếp dữ liệu theo tổng số lượng giảm dần
                const sortedSalesData = groupedSalesData.sort((a, b) => b.totalQuantity - a.totalQuantity);

                const totalSales = groupedSalesData.reduce((acc, item) => acc + item.totalPrice, 0);

                const formattedData = new Intl.NumberFormat('vi-VN').format(totalSales) + ' đồng';
                res.json({ revenue: formattedData, salesData: sortedSalesData });
            }
            else if (data.year) {
                const year = parseInt(data.year);

                const salesData = await OrderItem.aggregate([
                    {
                        $lookup: {
                            from: 'orders',
                            localField: 'order_id',
                            foreignField: '_id',
                            as: 'order'
                        }
                    },
                    {
                        $unwind: '$order'
                    },
                    {
                        $match: {
                            'order.order_date': { $exists: true },
                            $expr: {
                                $eq: [
                                    { $year: { $toDate: '$order.order_date' } },
                                    year
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'product_id',
                            foreignField: '_id',
                            as: 'product'
                        }
                    },
                    {
                        $unwind: '$product'
                    },
                    {
                        $group: {
                            _id: '$product_id',
                            productName: { $first: '$product.name' },
                            totalQuantity: { $sum: '$quantity' },
                            totalPrice: { $sum: { $multiply: ['$order.total_price', '$quantity'] } }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            productName: 1,
                            totalQuantity: 1,
                            totalPrice: 1
                        }
                    }
                ]);

                if (salesData.length === 0) {
                    return res.json({ revenue: 0 + ' đồng' });;
                }
                const groupedSalesData = salesData.reduce((acc, item) => {
                    const existingItem = acc.find(x => x.product_id === item.product_id);
                    if (existingItem) {
                        existingItem.totalQuantity += item.totalQuantity;
                        existingItem.totalPrice += item.totalPrice;
                    } else {
                        acc.push({
                            product_id: item.product_id,
                            productName: item.productName,
                            totalQuantity: item.totalQuantity,
                            totalPrice: item.totalPrice,
                        });
                    }
                    return acc;
                }, []);

                // Sắp xếp dữ liệu theo tổng số lượng giảm dần
                const sortedSalesData = groupedSalesData.sort((a, b) => b.totalQuantity - a.totalQuantity);

                const totalSales = groupedSalesData.reduce((acc, item) => acc + item.totalPrice, 0);

                const formattedData = new Intl.NumberFormat('vi-VN').format(totalSales) + ' đồng';
                res.json({ revenue: formattedData, salesData: sortedSalesData });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server.' });
        }
    } else {
        res.status(400).json({ error: 'Không có dữ liệu hoặc dữ liệu không hợp lệ.' });
    }
};
