from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()
clients: List[WebSocket] = []

@router.websocket("/notifications/subscribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # Ping from client
    except WebSocketDisconnect:
        clients.remove(websocket)

# Broadcast function (call this manually when a document is uploaded)
async def notify_all(message: str):
    for client in clients:
        await client.send_text(message)
