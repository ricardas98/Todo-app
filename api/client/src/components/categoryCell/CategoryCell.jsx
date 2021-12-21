import "./CategoryCell.css";

export const CategoryCell = ({ category }) => {
  return (
    <div className="category">
      <div className="categoryContent">
        <span className="categoryName">{category.name}</span>
      </div>
    </div>
  );
};
