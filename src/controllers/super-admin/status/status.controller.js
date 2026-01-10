const { errorResponse } = require("../../../config/response");
const adminModel = require("../../../models/AdminModel");
const schoolModel = require("../../../models/SchoolModel");

exports.monthlySchoolGrowth = async (req,res)=>{
    try {
        const year = req.query.year;
        const data = await schoolModel.aggregate([
            {
                $match : {
                createdAt : {
                    $gte : new Date(`${year}-01-01`),
                    $lte : new Date(`${year}-12-31`)
                }
            }
            },
            {
                $group : {
                _id : {$month:"$createdAt"},
                totalSchools : {$sum:1}
            }
            },
            {
                $sort : {"_id":1}
            }
        ]);
        const monthNames = [
      "", "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    const result = data.map(item => ({
      month: monthNames[item._id],
      totalSchools: item.totalSchools
    }));
    res.status(200).json({
      success: true,
      year,
      monthlySchoolCreate: result
    });

    } catch (error) {
        return errorResponse(res,500,"Something went wrong",error.message);
    }
}

exports.yearlySchoolGrowth = async (req, res) => {
  try {
    const data = await schoolModel.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
          totalSchools: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    const result = data.map(item => ({
      year: item._id,
      totalSchools: item.totalSchools
    }));

    res.status(200).json({
      success: true,
      yearlySchoolCreate: result
    });

  } catch (error) {
    return errorResponse(
      res,
      500,
      "Something went wrong",
      error.message
    );
  }
};



exports.monthlyAdminlGrowth = async (req,res)=>{
    try {
        const year = req.query.year;
        const data = await adminModel.aggregate([
            {
                $match : {
                createdAt : {
                    $gte : new Date(`${year}-01-01`),
                    $lte : new Date(`${year}-12-31`)
                }
            }
            },
            {
                $group : {
                _id : {$month:"$createdAt"},
                totalAdmin : {$sum:1}
            }
            },
            {
                $sort : {"_id":1}
            }
        ]);
        const monthNames = [
      "", "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    const result = data.map(item => ({
      month: monthNames[item._id],
      totalAdmin: item.totalAdmin
    }));
    res.status(200).json({
      success: true,
      year,
      monthlyAdminCreate: result
    });

    } catch (error) {
        return errorResponse(res,500,"Something went wrong",error.message);
    }
}
