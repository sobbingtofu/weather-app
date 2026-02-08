import {FavoriteList} from "@/widgets/favorite-list";

export function FavouritesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">즐겨찾는 위치</h1>
        </header>
        <FavoriteList />
      </div>
    </div>
  );
}
