<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SecurityController extends Controller
{
    public function getSecurityLevel()
    {
        return response()->json([
            'security_level' => Auth::user()->security_level
        ]);
    }

    public function setSecurityLevel(Request $request)
    {
        $request->validate([
            'security_level' => 'required|in:low,normal'
        ]);

        $user = Auth::user();
        $user->security_level = $request->security_level;
        $user->save();

        return response()->json([
            'message' => 'Security level updated to ' . $request->security_level,
            'security_level' => $user->security_level
        ]);
    }
}
