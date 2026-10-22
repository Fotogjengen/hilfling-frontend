import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import styles from "./categories.module.css";
import { CategoryDto, CategoryPatchRequestDto } from "@/../generated";
import ArchiveBossItem from "@/components/Arkivsjef/ArchiveBossItem/ArchiveBossItem";
import { ScrollArea } from "radix-ui";
import { SearchField } from "@/components/ui/input/SearchField";
import { Select } from "@/components/ui/input/Select";
import { useCategories, useDeleteCategory, useUpdateCAtegoey } from "@/hooks/category";
import ArchiveBossEditCategorySchema from "@/components/Arkivsjef/ArchiveBossEditCategorySchema/ArchiveBossEditCategorySchema";

export const Route = createFileRoute(
  "/_fgAuthenticated/fg/archiveBoss/categories",
)({
  component: Categories,
});
const sortOptions = [
  { label: "Navn A-Å", value: "nameAsc" },
  { label: "Navn Å-A", value: "nameDesc" },
];

function Categories() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nameAsc");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [editCategoryPopUp, setEditCategoryPopUp] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useCategories();
    const deleteCategory = useDeleteCategory();
    const patchCayetory = useUpdateCAtegoey();

  useEffect(() => {
    setCategories(data ?? []);
  }, [data]);

  const onDelete = (category : CategoryDto) => {
    deleteCategory.mutate(category.categoryId.id);
    onClose();
  };
  const onPatch = (category : CategoryDto) => {
    const patch_object: CategoryPatchRequestDto = {
      categoryId: category.categoryId,
      name: category.name,
    };
    patchCayetory.mutate(patch_object);
    onClose();
  };
  
  const onClose = () =>{
    setEditCategoryPopUp(false)
  };
 
  const onEdit = (category: CategoryDto) => {
    setEditCategoryPopUp(true)
    setEditingId(category.categoryId.id)
  };

  const filteredAndSortedCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(normalizedSearch),
    );
    return filtered.toSorted((a, b) => {
      switch (sort) {
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [categories, sort, search]);

  return (
    <div className={styles.album_page}>
      <header className={styles.pageHeader}>
        <h1>Kategori</h1>
      </header>
      <div className={styles.toolbar}>
        <SearchField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
          placeholder="Sok etter kategori"
          aria-label="Sok etter kategori"
          className={styles.search}
        />
        <div className={styles.controls}>
          <label className={styles.sortControl}>
            <span> Sorter </span>
            <Select
              options={sortOptions}
              value={sort}
              onValueChange={setSort}
              className={styles.sortSelect}
            />
          </label>
        </div>
      </div>

      {isLoading ? (
        <p> Laster kategorier... </p>
      ) : (
        <div>
          <ScrollArea.Root className={styles.scrollArea}>
            <ScrollArea.Viewport className={styles.scrollAreaViewport}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th> Kategorier </th>
                    <th> Handlinger </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedCategories.map((categories, index) => (
                    <ArchiveBossItem<CategoryDto>
                      key={categories.categoryId.id}
                      Type = 'category'
                      dtoObject={categories}
                      columns={[categories.name]}
                      editPopUp ={(editingId === categories.categoryId.id) && editCategoryPopUp}
                      onDelete={onDelete}
                      onPatch={onPatch}
                      onClose={onClose}
                      onEdit={onEdit}
                      EditSchema={ArchiveBossEditCategorySchema}
                    />
                  ))}
                </tbody>
              </table>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      )}
    </div>
  );
}
