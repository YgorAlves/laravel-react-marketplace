<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class OrderItemResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'item_id' => $this->item_id,
            'title' => $this->item->title,
            'image_url' => $this->item->image_url,
            'review' => array_filter($this->item->reviews->toArray(), fn($r) => $r['user_id'] === Auth::id())
        ];
    }
}
