const { errorResponse, successResponse } = require("../../config/response");
const notificationModel = require("../../models/NotificationModel");

exports.allNotification = async (req,res)=>{
    try {
        const data = await notificationModel.find().sort({createdAt:-1});
        if(data) return successResponse(res,200,"All notification find successfully",data);
        return errorResponse(res,404,"Notification not found",null);
    } catch (error) {
        return errorResponse(res,500,"Something went wrong.",error);
    }
};


exports.unreadNotification = async (req,res)=>{
    try {
        const filter = {
            isRead : false
        };

        const data = await notificationModel.find(filter).sort({createdAt:-1});
        return successResponse(res,200,"Unread notification fetch successfully",data);
        
    } catch (error) {
        errorResponse(res,500,"Something went wrong",error.message);
    }
};

exports.readNotification = async (req,res)=>{
    const id = req.params.id;
    const filter = {
        _id : id
    };
    try {

        await notificationModel.findByIdAndUpdate(filter,{isRead:true},{upsert:true});

        return successResponse(res,200,"Notification read successfully",null);
        
    } catch (error) {
        errorResponse(res,500,"Something went wrong",error.message);
    }
};


exports.readAllNotification = async (req,res)=>{
    try {
        await notificationModel.updateMany({isRead:false},{$set : {isRead:true}});
        return successResponse(res,200,"All notification read successfully",null);
        
    } catch (error) {
        errorResponse(res,500,"Something went wrong",error.message);
        
    }
}