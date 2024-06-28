const OrderItem = require('../models/orderItemModel');

exports.getRevenue = async (req, res) => {
    const data = req.body;

    if (data) {
        try {
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
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$order.order_date" } },
                        totalSales: { $sum: { $multiply: ['$order.total_price', '$quantity'] } }
                    }
                },
                {
                    $sort: { _id: 1 } // Sort by date
                },
                {
                    $project: {
                        _id: 0,
                        date: '$_id',
                        totalSales: 1
                    }
                }
            ]);
            
            const labels = salesData.map(data => data.date);
            const datasets = salesData.map(data => data.totalSales);
            return res.status(200).json({ success: true, data: { labels: labels, datasets: datasets } });
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Lỗi", error: error.message });
        }
    } else {
        return res
            .status(500)
            .json({ success: false, message: "Lỗi", error: error.message });
    }
};
