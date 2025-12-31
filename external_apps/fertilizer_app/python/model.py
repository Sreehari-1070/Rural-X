import torch
import torch.nn as nn

class FertilizerModel(nn.Module):
    def __init__(self):
        super().__init__()
        # Checkpoint expects Input=3, Hidden=32 based on error logs
        self.net = nn.Sequential(
            nn.Linear(3, 32),
            nn.ReLU(),
            nn.Linear(32, 32),
            nn.ReLU(),
            nn.Linear(32, 6)
        )

    def forward(self, x):
        return self.net(x)
