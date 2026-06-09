<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SecurityController;
use App\Http\Controllers\Api\VulnerabilityController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Security Settings
    Route::get('/security-level', [SecurityController::class, 'getSecurityLevel']);
    Route::post('/security-level', [SecurityController::class, 'setSecurityLevel']);

    // Vulnerability Testing
    Route::get('/vulnerable/sql-injection', [VulnerabilityController::class, 'sqlInjection']);
    Route::get('/vulnerable/xss', [VulnerabilityController::class, 'xss']);

    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Dashboard!',
            'status' => 'success',
            'timestamp' => now()
        ]);
    });
});

Route::get('/test', function () {
    return response()->json([
        'message' => 'Backend Laravel 12 is connected!',
        'status' => 'success',
        'timestamp' => now()
    ]);
});
