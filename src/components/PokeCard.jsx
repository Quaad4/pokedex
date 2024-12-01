import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard  from './TypeCard';

export default function PokeCard(props) {
    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const {name, height, abilities, stats, types, moves, sprites} = data || {}

    useEffect(() => {
        // if loading, exit logic
        if(loading || !localStorage) {
            return
        }

        // check if selected pokemon information is available in the cache
        // 1. define the cache
        let cache = {}
        if(localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        // 2. check if selected pokemon is in cache otherwise fetch from api
        if(selectedPokemon in cache) {  
            setData(cache[selectedPokemon])
            return
        }

        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseURl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseURl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)

                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

        // if we fetch from api make sure to save information to the cache for next time
    }, [selectedPokemon]);

    if (loading || !data) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return (
        <div className="poke-card">
            <div>
                <h4>
                    #{getFullPokedexNumber(selectedPokemon)}
                </h4>
                <h2>
                    {name}
                </h2>
                <div className='type-container'>
                    {types.map((typeObj, typeIndex) => {
                        return (
                            <TypeCard key={typeIndex} type={typeObj?.type?.name}/>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}