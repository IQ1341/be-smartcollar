import { successResponse } from "../../core/response/response.js";

import * as monitoringService from "./monitoring.service.js";

/*
|--------------------------------------------------------------------------
| POST /api/v1/monitoring
| Digunakan oleh ESP32
|--------------------------------------------------------------------------
*/

export const receive = async (req, res, next) => {
    try {
        const monitoring = await monitoringService.receiveMonitoring(req.body);
        return successResponse(res, monitoring, "Monitoring received successfully");
    } catch (error) {
        next(error);
    }
};
/*
|--------------------------------------------------------------------------
| GET /api/v1/monitoring/latest
|--------------------------------------------------------------------------
*/

export const getLatest = async (req, res, next) => {
    try {
        const monitoring = await monitoringService.getLatest(req.user.ownerId);
        res.set({
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Surrogate-Control": "no-store"
        });
        return successResponse(res, monitoring, "Latest monitoring retrieved successfully");
    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| GET /api/v1/monitoring/latest/:cowId
|--------------------------------------------------------------------------
*/

export const getLatestByCow = async (req, res, next) => {
    try {
        const monitoring = await monitoringService.getLatestByCow(req.user.ownerId, req.params.cowId);
        return successResponse(res, monitoring, "Monitoring retrieved successfully");
    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| GET /api/v1/monitoring/history/:cowId
|--------------------------------------------------------------------------
*/

export const getHistory = async (req, res, next) => {
    try {
        const history = await monitoringService.getHistory(req.user.ownerId, req.params.cowId, req.query);
        return successResponse(res, history, "Monitoring history retrieved successfully");
    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| GET /api/v1/monitoring/debug/latest
| Debug endpoint - no authentication required
|--------------------------------------------------------------------------
*/

export const getLatestDebug = async (req, res, next) => {
    try {
        console.log('[DEBUG] Debug endpoint called - skipping authentication');
        // Use the same owner ID as the test data
        const monitoring = await monitoringService.getLatest('lRAPbzLWIHMhD70rfP0DBWE79eo1');
        return successResponse(res, monitoring, "Debug monitoring data retrieved successfully");
    } catch (error) {
        console.error('[DEBUG] Error in debug endpoint:', error);
        next(error);
    }
};