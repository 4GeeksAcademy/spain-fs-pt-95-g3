import { createContext, useState, useContext } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favoriteRecipes');
        return saved ? JSON.parse(saved) : [];
    });

    const addFavorite = (recipe) => {
        setFavorites(prev => {
            const update = [...prev, recipe];
            localStorage.setItem('favoriteRecipes', JSON.stringify(update));
            return update;        
        });
    };

    const removeFavorite = (id) => {
        setFavorites(prev => {
            const update = prev.filter(item => item.id !== id);
            localStorage.setItem('favoriteRecipes', JSON.stringify(update));
            return update;
        });
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = ()  => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
    }
    return context;
}

