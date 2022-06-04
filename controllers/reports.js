const Report = require('../models/Report');
const Joi = require('joi');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Add report
// @route POST /v1/api/reports
// @public
module.exports.addReport = asyncHandler(async (req, res, next) => {
  // Validating req object
  const result = validate(req.body.reportDetails);
  if (result.error) {
    return next(new ErrorResponse(result.error.details[0].message), 400);
  }

  // Creating new Copy of report with few changes and addition fields
  const report = { ...req.body.reportDetails };

  // Storing price in per Kg
  report.price = Math.round(report.price / report.convFctr);
  report.priceUnit = 'kg';

  const { marketID, cmdtyID } = req.body.reportDetails;
  const aggrReport = await Report.findOne({
    marketID,
    cmdtyID,
    timestamp: { $gte: Date.now() - 1000 * 60 * 60 * 24 },
  });

  if (!aggrReport) {
    // Few other changes in report object
    report.users = [report.userID];

    // Fields to remove from report
    const removeFields = ['userID', 'convFctr'];
    removeFields.forEach((field) => delete report[field]);

    const newAggrReport = await Report.create(report);
    return res.status(200).json({
      success: true,
      reportID: newAggrReport._id,
    });
  }

  // Stoping same user from adding same cmdty report again.
  if (aggrReport.users.includes(report.userID)) {
    return next(
      new ErrorResponse(
        `You have already put the data regarding this ${report.cmdtyID}`,
        400
      )
    );
  }

  aggrReport.price = Math.round((aggrReport.price + report.price) / 2);

  aggrReport.users.push(report.userID);

  const newAggrReport = await aggrReport.save();

  res.status(200).json({
    success: true,
    reportID: newAggrReport._id,
  });
});

// @desc Get All Reports or Get Report By ID
// @route POST /v1/api/reports
// @private (can only be access by mandi commision agent)
module.exports.getReports = asyncHandler(async (req, res, next) => {
  if (req.query.reportID) {
    const report = await Report.findById(req.query.reportID);
    if (!report) {
      return next(new ErrorResponse('Invalid reportID.', 400));
    }

    return res.status(200).json({
      success: true,
      count: 1,
      data: report,
    });
  }

  const reports = await Report.find();

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
});

const validate = (obj) => {
  const schema = Joi.object({
    userID: Joi.string().required(),
    marketID: Joi.string().required(),
    marketName: Joi.string().required(),
    cmdtyID: Joi.string().required(),
    marketType: Joi.string().required(),
    cmdtyName: Joi.string().required(),
    priceUnit: Joi.string().required(),
    convFctr: Joi.number().required(),
    price: Joi.number().required(),
  });

  return schema.validate(obj);
};
