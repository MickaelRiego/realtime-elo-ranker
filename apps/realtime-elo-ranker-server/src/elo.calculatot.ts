/**
 * Constante K : Facteur de sensibilité du classement.
 * Défini à 32 comme dans l'exemple du README.
 */
const K_FACTOR = 32;

/**
 * Calcule la probabilité de victoire attendue (We).
 * Formule : We = 1 / (1 + 10^((Rh - Rl) / 400))
 * * @param ratingPlayer Classement du joueur pour qui on calcule la probabilité
 * @param ratingOpponent Classement de l'adversaire
 */
export const calculateExpectedScore = (ratingPlayer: number, ratingOpponent: number): number => {
  const diff = ratingOpponent - ratingPlayer;
  return 1 / (1 + Math.pow(10, diff / 400));
};

/**
 * Calcule le nouveau classement Elo.
 * Formule : Rn = Ro + K * (W - We)
 * * @param currentRating (Ro) Classement actuel
 * @param actualScore (W) Résultat (1 pour victoire, 0.5 nul, 0 défaite)
 * @param expectedScore (We) Probabilité de victoire calculée
 */
export const calculateNewRating = (currentRating: number, actualScore: number, expectedScore: number): number => {
  const newRating = currentRating + K_FACTOR * (actualScore - expectedScore);
  return Math.round(newRating); // Arrondi à l'entier le plus proche
};