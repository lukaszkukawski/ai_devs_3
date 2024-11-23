import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { genSimpleAnswerFromAiWithSystem, getRESULT } from '../../lib/genSimpleAnswerFromAi';
import path from 'path';
import { join } from 'path';
import fs from 'fs';
import { OpenAIService } from '@/app/lib/OpenAIService';
import { Neo4jService } from "@/app/lib/Neo4jService";

const openAIService = new OpenAIService();
const neo4jService = new Neo4jService(
  process.env.NEXT_PUBLIC_NEO4J_URI,
  process.env.NEXT_PUBLIC_NEO4J_USER,
  process.env.NEXT_PUBLIC_NEO4J_PASSWORD,
  openAIService
);

const openai = new OpenAIService();
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_API;


export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type');
    
    if (type == 'users') {
        const response = await getUsers();
        return NextResponse.json({ response });
    } else if(type == 'connections') {
        const response = await getConnections();
        return NextResponse.json({ response });
    } else if(type == 'findShortesWay') {
        const response = await findShortestPath('Rafał','Barabra');
        return NextResponse.json({ response });
    }
}

async function getUsers() {

    await neo4jService.createVectorIndex('user_index', 'Person', 'embedding', 3072);
    await neo4jService.waitForIndexToBeOnline('user_index');

    if (endpoint) {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                "task":"database",
                "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                "query": "SELECT * FROM users"
            })
        });
        const data = await response.json();
        console.log("data", data);
        
        const filePath = path.join(process.cwd(), 'src/S03E05/user.json');
        fs.writeFileSync(filePath, JSON.stringify(data.reply, null, 2), 'utf8');
        
        for (const user of data.reply) {
            //const embedding = await openAIService.createEmbedding(user.username);
            await neo4jService.addNode('Person', { username: user.username, id:user.id });
        }
    }
    return "ok";
}

async function getConnections(){
    if (endpoint) {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                "task":"database",
                "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                "query": "SELECT * FROM connections"
            })
        });
        const data = await response.json();
        console.log("data", data);
        const filePath = path.join(process.cwd(), 'src/S03E05/connections.json');
        fs.writeFileSync(filePath, JSON.stringify(data.reply, null, 2), 'utf8');
        let count = 0;
        for (const connection of data.reply) {
            const { user1_id, user2_id } = connection;

            console.log(`Connecting ${user1_id} to ${user2_id}`);

            try {
                const user1Node = await neo4jService.findNodeByProperty('Person', 'id', user1_id);
                const user2Node = await neo4jService.findNodeByProperty('Person', 'id', user2_id);


                if (user1Node && user2Node) {
                    // Połącz węzły za pomocą ich wewnętrznych identyfikatorów
                    await neo4jService.connectNodes(user1Node.id, user2Node.id, 'KNOWS');
                    console.log(`Connected ${user1_id} to ${user2_id}`);
                } else {
                    console.error(`Could not find nodes for user1_id: ${user1_id} or user2_id: ${user2_id}`);
                }
            } catch (error) {
                console.error(`Failed to connect ${user1_id} to ${user2_id}:`, error);
            }
            count++;
        }
        console.log("Wszystkich połączeń =", count)
    }
}

async function findShortestPath(fromName: string, toName: string): Promise<string[]> {
    const cypher = `
   MATCH (start:Person {username: $fromName}), (end:Person {username: $toName}),
    p = shortestPath((start)-[:KNOWS*]->(end))
    RETURN [n IN nodes(p) | n.username] AS names
  `;
    const result = await this.runQuery(cypher, { fromName, toName });
    if (result.records.length === 0) {
      throw new Error(`No path found between ${fromName} and ${toName}`);
    }
    return result.records[0].get('names');
  }

  async function findShortesWay() {
    const fs = require('fs');
    const path = require('path');

    // Wczytaj dane z plików JSON
    const usersFilePath = path.join(__dirname, 'src/S03E01/user.json');
    const connectionsFilePath = path.join(__dirname, 'src/S03E01/connections.json');

    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const connections = JSON.parse(fs.readFileSync(connectionsFilePath, 'utf8'));

    // Zbuduj mapę id -> username
    const idToUsername = {};
    users.forEach(user => {
        idToUsername[user.id] = user.username;
    });

    // Zbuduj graf jako mapę username -> [sąsiedzi]
    const graph = {};
    connections.forEach(connection => {
        const user1 = idToUsername[connection.user1_id];
        const user2 = idToUsername[connection.user2_id];
        
        if (!graph[user1]) {
            graph[user1] = [];
        }
        graph[user1].push(user2);
    });

// Funkcja do znalezienia najkrótszej ścieżki
    function findShortestPath(start, end) {
        if (!graph[start] || !graph[end]) {
            return null;
        }

        const queue = [[start]];
        const visited = new Set();

        while (queue.length > 0) {
            const path = queue.shift();
            const node = path[path.length - 1];

            if (node === end) {
                return path;
            }

            if (!visited.has(node)) {
                visited.add(node);
                const neighbors = graph[node] || [];

                for (const neighbor of neighbors) {
                    const newPath = [...path, neighbor];
                    queue.push(newPath);
                }
            }
        }

        return null;
    }

    // Znajdź najkrótszą ścieżkę między "Rafał" a "Barbara"
    const shortestPath = findShortestPath('Rafał', 'Barbara');
    console.log('Najkrótsza ścieżka:', shortestPath);
    return shortestPath;
}