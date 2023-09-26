<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();
        if (!$user)
            throw new UnauthorizedHttpException('Unauthorized');

        $review = Review::query()->where(['user_id' => $user->id, 'item_id' => $data['item_id']])->first();
        if ($review) {
            $review->update([
                'summary' => $data['summary']
            ]);
        } else {
            Review::create([...$data, 'user_id' => $user->id]);
        }

        return response('', 201);
    }

}
