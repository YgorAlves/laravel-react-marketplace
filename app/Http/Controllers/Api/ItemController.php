<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Http\Resources\ItemResource;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ItemResource::collection(
            Item::query()->where(['user_id' => Auth::id()])->orderBy('id', 'desc')->paginate(10)
        );
    }

    public function indexDashboard()
    {
        return ItemResource::collection(
            Item::query()->orderBy('id', 'desc')->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();
        if (!$user)
            throw new UnauthorizedHttpException('Unauthorized');

        /** @var Item $item */
        $item = Item::create([...$data, 'user_id' => Auth::id()]);

        return response(new ItemResource($item), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        return new ItemResource($item);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        $data = $request->validated();

        if ($item->user_id !== Auth::id())
            throw new UnauthorizedHttpException('Unauthorized');

        $item->update($data);

        return new ItemResource($item);
    }

    public function uploadImage(Request $request, $id)
    {
        $file = $request->file('image');

        $destinationPath = 'uploads';

        $path = $file->move($destinationPath,time().$file->getClientOriginalName());

        $item = Item::query()->find($id);
        $item->image_url = $destinationPath.'/'.$path->getFilename();
        $item->save();

        response(new ItemResource($item), 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $item->delete();

        return response("", 204);
    }
}
