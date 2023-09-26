<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\ItemResource;
use App\Http\Resources\OrderItemResource;
use App\Http\Resources\OrderResource;
use App\Models\Item;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return OrderResource::collection(
            Order::query()->with('orderItems.item')->where(['user_id' => Auth::id()])->orderBy('id', 'desc')->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();
        if (!$user)
            throw new UnauthorizedHttpException('Unauthorized');

        /** @var Order $order */
        $order = Order::create(['user_id' => Auth::id()]);

        /** @var OrderItem $orderItems */

        foreach ($data['items'] as $key => $value) {
            $data['items'][$key]['item_id'] = $data['items'][$key]['id'];
            unset($data['items'][$key]['id']);
            OrderItem::create([...$data['items'][$key], 'order_id' => $order->id]);

            $item = Item::query()->where(['id' => $data['items'][$key]['item_id']])->first();
            if ($item) {
                $item->stock -= $data['items'][$key]['quantity'];
                $item->save();
            }
        }
        return response(new OrderResource($order), 201);
    }

    public function orderItems()
    {
        return OrderItemResource::collection(
            OrderItem::query()->select('item_id')->with('item.reviews')->with('order')->whereRelation('order','user_id', Auth::id())->groupBy('item_id')->get()
        );
    }
}
