import { TestsCards } from "../types";
import styles from "../styles/TestsCards.module.css";

function TestsCard({
  id,
  nombre,
  onClick,
  showTemaLabel = true,
  inputValue,
  onInputChange,
}: TestsCards) {
  return (
    <div
      className={styles.cards}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.cardHeader}>
        {showTemaLabel ? `Tema ${id}` : id}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardContent}>
          <p className={styles.cardTitle}>{nombre}</p>

          {typeof inputValue === "number" && onInputChange && (
            <input
              type="number"
              min={1}
              max={500}
              value={inputValue}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onInputChange(Number(e.target.value))}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TestsCard;
