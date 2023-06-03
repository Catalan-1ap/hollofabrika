import { Database } from "arangojs";
import { DbProduct } from "../../infrastructure/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";


function ZOV(str: string) {
    const engCodes = [ ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" ].map(x => x.charCodeAt(0));
    const rusCodes = [ ..."АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя" ].map(x => x.charCodeAt(0));
    const numbersCodes = [ ..."0123456789" ].map(x => x.charCodeAt(0));
    const numbers = [ ..."0123456789" ];

    function toTrash(char: string) {
        const initialValue = char.charCodeAt(0);
        const initialMin = numbers.includes(char) ? Math.min(...numbersCodes) : Math.min(...rusCodes);
        const initialMax = numbers.includes(char) ? Math.max(...numbersCodes) : Math.max(...rusCodes);
        const newMax = engCodes.length - 1;
        const newMin = 0;
        const engIndex = Math.floor((initialValue - initialMin) * (newMax - newMin) / (initialMax - initialMin) + newMin);
        return String.fromCharCode(engCodes[engIndex]);
    }

    return [ ...str ].map(toTrash).join("");
}

export const getCategoryCollection = (db: Database, name: string) =>
    db.collection<DbProduct>(`category-${ZOV(name)}`);

const setup: SetupHandler = async (db) => {

};

export default setup;