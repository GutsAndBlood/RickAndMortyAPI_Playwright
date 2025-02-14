import { test, expect } from '@playwright/test';
import { CharacterAPI } from '../main/CharacterAPI';

let characterAPI: CharacterAPI;

test.beforeEach(async () => {
    characterAPI = new CharacterAPI();
    await characterAPI.init();
});

test('tc001_validateCharacterEndpointHeaderResponse', async () => {
    const response = await characterAPI.getAllCharacters();
    expect(response.status()).toBe(200);
    expect(response.headers()['access-control-allow-origin']).toBe('*');
    expect(response.headers()['content-type']).toContain('application/json');
});

test('tc002_validateCharacterEndpointBodyParametersFirstCall', async () => {
    const response = await characterAPI.getAllCharacters();
    const body = await response.json();

    console.log(body);
    expect(body.info.count).toBeDefined();
    expect(body.info.pages).toBeDefined();
    expect(body.info.next).toBeDefined();
    expect(body.info.prev).toBeNull();
    expect(body.results[0].id).toBeDefined();
    expect(body.results[0].name).toBeDefined();
});

test('tc003_validateCharacterEndpointInfoParametersFirstCall', async () => {
    const response = await characterAPI.getAllCharacters();
    const body = await response.json();

    expect(body.info.count).toBe(826);
    expect(body.info.pages).toBe(42);
    expect(body.info.next).toBe('https://rickandmortyapi.com/api/character?page=2');
    expect(body.info.prev).toBeNull();
});

test('tc004_validateCharacterEndpointInfoParametersSecondCall', async () => {
    const response = await characterAPI.getAllCharacters('?page=2');
    const body = await response.json();

    expect(body.info.count).toBe(826);
    expect(body.info.pages).toBe(42);
    expect(body.info.next).toBe('https://rickandmortyapi.com/api/character?page=3');
    expect(body.info.prev).toBe('https://rickandmortyapi.com/api/character?page=1');
});

test('tc010_validateCharacterEndpointResultsParametersFirstUsername', async () => {
    const response = await characterAPI.getAllCharacters('?page=1');
    const body = await response.json();

    expect(body.results[0].id).toBe(1);
    expect(body.results[0].name).toBe('Rick Sanchez');
    expect(body.results[0].status).toBe('Alive');
});

test('tc011_validateCharacterEndpointResultsErrorNumberOfPages', async () => {
    const response = await characterAPI.getAllCharacters('?page=55');
    const body = await response.json();
    
    expect(response.status()).toBe(404);
    expect(body.error).toBe('There is nothing here');
});

test('tc020_validateCharacterEndpointFilterByID', async () => {
    const response = await characterAPI.getCharacterById(2);
    const body = await response.json();

    expect(body.id).toBe(2);
    expect(body.name).toBe('Morty Smith');
});

test('tc021_validateCharacterEndpointErrorFilteringByID', async () => {
    const response = await characterAPI.getCharacterById(966);
    const body = await response.json();
    
    expect(response.status()).toBe(404);
    expect(body.error).toBe('Character not found');
});

test('tc030_validateCharacterEndpointFilterByMultipleIDs', async () => {
    const response = await characterAPI.getMultipleCharacters('200,369');
    const body = await response.json();

    expect(body[0].id).toBe(200);
    expect(body[1].id).toBe(369);
    expect(body[2]).toBeUndefined();
});


test('tc100_validateCSVToJson', async () => {
    const jsonData = await characterAPI.readCSVtoJSON();
    const hasBobBrown = jsonData.some((user: { name: string; }) => user.name === "Bob Brown");
    expect(hasBobBrown).toBeTruthy();
    console.log("Bob Brown User Is On Json File")
});


