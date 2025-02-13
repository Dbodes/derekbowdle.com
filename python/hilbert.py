import matplotlib.pyplot as plt
import numpy as np
import librosa

def rotate_right(n, rx, ry, point):
    """Helper function to handle rotation of points in the Hilbert curve."""
    if ry == 0:
        if rx == 1:
            point[0] = n-1 - point[0]
            point[1] = n-1 - point[1]
        point[0], point[1] = point[1], point[0]

def d2xy(n, d):
    """
    Convert a distance along the Hilbert curve (d) to (x,y) coordinates.
    The curve will fill a square of size n by n.
    n must be a power of 2.
    
    Args:
        n (int): Size of the 2D grid (must be power of 2)
        d (int): Distance along the Hilbert curve
        
    Returns:
        tuple: (x, y) coordinates in the 2D grid
    """
    point = [0, 0]
    rx = ry = 0
    s = 1
    t = d
    
    while s < n:
        rx = 1 & (t >> 1)
        ry = 1 & (t ^ rx)
        rotate_right(s, rx, ry, point)
        point[0] += s * rx
        point[1] += s * ry
        t >>= 2
        s <<= 1
    
    return point[0], point[1]

def hilbert_transform_1d_to_2d(values, n=None):
    """
    Transform a 1D array into a 2D array using a Hilbert curve mapping.
    
    Args:
        values (list): One-dimensional array of values
        n (int, optional): Size of the output grid. If None, will use the next power of 2
                          that can fit all values.
    
    Returns:
        list: 2D array with values mapped according to Hilbert curve
    
    Examples:
        >>> values = [1, 2, 3, 4]
        >>> hilbert_transform_1d_to_2d(values)
        [[1, 2],
         [4, 3]]
    """
    
    # Calculate required size if not provided
    if n is None:
        n = 1
        while n * n < len(values):
            n *= 2

    # Verify n is a power of 2
    if n & (n-1) != 0:
        raise ValueError("Grid size must be a power of 2")
    
    # Initialize 2D array with None
    result = [[None for _ in range(n)] for _ in range(n)]
    
    # Map each value to its 2D position
    for i, value in enumerate(values):
        if i >= n * n:
            break
        x, y = d2xy(n, i)
        result[y][x] = value
    
    return result

import numpy as np
import matplotlib.pyplot as plt

def visualize_hilbert_path(array_2d):
    """
    Create a visualization of the path through a 2D array, connecting values in order.
    
    Args:
        array_2d (list): 2D array of values arranged in a Hilbert curve pattern
        
    Returns:
        None (displays the plot)
    """
    # Convert to numpy array if it isn't already
    array_2d = np.array(array_2d)
    n = len(array_2d)
    
    # Create a mapping of values to their positions
    positions = {}
    for y in range(n):
        for x in range(n):
            value = array_2d[y][x]
            if value is not None:
                positions[value] = (x, y)
    
    # Sort the values to get the correct order
    sorted_values = sorted([v for v in positions.keys() if v is not None])
    
    # Create the plot
    plt.figure(figsize=(10, 10))
    
    # Plot points
    for value in sorted_values:
        x, y = positions[value]
        plt.plot(x, y, 'bo', markersize=8)  # Blue dots for points
        plt.text(x + 0.1, y + 0.1, str(value), fontsize=12)  # Label each point
    
    # Draw lines connecting points in order
    for i in range(len(sorted_values) - 1):
        current_value = sorted_values[i]
        next_value = sorted_values[i + 1]
        
        current_pos = positions[current_value]
        next_pos = positions[next_value]
        
        plt.plot(
            [current_pos[0], next_pos[0]], 
            [current_pos[1], next_pos[1]], 
            'r-', alpha=0.6  # Red lines with some transparency
        )
    
    # Customize the plot
    plt.grid(True)
    plt.title('Hilbert Curve Path')
    plt.xlabel('X')
    plt.ylabel('Y')
    
    # Set proper axis limits with some padding
    plt.xlim(-0.5, n - 0.5)
    plt.ylim(-0.5, n - 0.5)
    
    # Invert y-axis to match array indexing
    plt.gca().invert_yaxis()
    
    # Show the plot
    plt.show()


def prep_data_for_hilbert(list):
    n = int(np.floor(np.log(len(list))/np.log(4)))
    return list[:4**int(n)]



def mp3_to_channels(file_path, sr=44100):
    """
    Convert MP3 file to three-channel array representing:
    1. Waveform amplitude
    2. Spectral centroid (brightness)
    3. Root Mean Square Energy (volume/intensity)
    
    Parameters:
    file_path (str): Path to MP3 file
    sr (int): Sample rate (default: 44100 Hz)
    
    Returns:
    numpy.ndarray: Array with shape (3, n_samples)
    """
    # Load the audio file
    y, sr = librosa.load(file_path, sr=sr)
    
    # Channel 1: Waveform amplitude (raw audio signal)
    channel1 = y
    
    # Channel 2: Spectral centroid (brightness)
    spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    # Resample to match length of original signal
    channel2 = np.interp(
        np.linspace(0, len(spectral_centroids), len(y)),
        np.arange(len(spectral_centroids)),
        spectral_centroids
    )
    
    # Channel 3: RMS Energy (volume/intensity)
    hop_length = 512
    rms = librosa.feature.rms(y=y, hop_length=hop_length)[0]
    # Resample to match length of original signal
    channel3 = np.interp(
        np.linspace(0, len(rms), len(y)),
        np.arange(len(rms)),
        rms
    )
    
    # Stack channels
    three_channel_array = np.vstack((channel1, channel2, channel3))
    
    return three_channel_array

def normalize_array(arr, new_min=0, new_max=1):
    """
    Normalizes an array to a given range [new_min, new_max].
    
    Parameters:
        arr (array-like): Input array to normalize.
        new_min (float): The minimum value of the new range.
        new_max (float): The maximum value of the new range.
    
    Returns:
        np.ndarray: Normalized array.
    """
    arr = np.array(arr, dtype=np.float64)
    old_min, old_max = arr.min(), arr.max()
    
    if old_min == old_max:
        return np.full_like(arr, new_min)  # Avoid division by zero for constant arrays
    
    return (arr - old_min) / (old_max - old_min) * (new_max - new_min) + new_min

def plot_with_values(ax, image, title, cmap="gray"):
    """Helper function to plot image and annotate with values."""
    ax.imshow(image, cmap=cmap)
    ax.set_title(title)
    ax.axis("off")

    # Annotate each pixel with its value
    rows, cols = image.shape
    for i in range(rows):
        for j in range(cols):
            ax.text(j, i, f"{image[i, j]}", ha='center', va='center', 
                    color='red', fontsize=12, fontweight='bold')

# Example usage
def main():
    file_path = r"C:\Users\dkbow\GIT\derekbowdle.com\db\public\audio\Lie_Cheat_Steal.mp3"
    audio_channels = mp3_to_channels(file_path)
    
    # Optional: Plot the channels
    import matplotlib.pyplot as plt
    
    plt.figure(figsize=(15, 8))
    for i in range(3):
        plt.subplot(3, 1, i+1)
        plt.plot(audio_channels[i])
        plt.title(f"Channel {i+1}")
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    file_path = r"C:\Users\dkbow\GIT\derekbowdle.com\db\public\audio\Lie_Cheat_Steal.mp3"
    audio_channels = mp3_to_channels(file_path)
    
    c1 = normalize_array(prep_data_for_hilbert(audio_channels[0]),0,255)[:256]
    c2 = normalize_array(prep_data_for_hilbert(audio_channels[1]),0,255)[:256]
    c3 = normalize_array(prep_data_for_hilbert(audio_channels[2]),0,255)[:256]
    print("preped")

    h1 = hilbert_transform_1d_to_2d(c1)
    h2 = hilbert_transform_1d_to_2d(c2)
    h3 = hilbert_transform_1d_to_2d(c3)
    print("transformed")
    stacked = np.stack([h1, h2, h3], axis=-1)
    print(stacked)
    # Create a figure with 2 rows and 2 columns
    fig, axes = plt.subplots(2, 2, figsize=(10, 10))

    # Plot the stacked image
    axes[0, 0].imshow(stacked)
    axes[0, 0].set_title("Stacked Image")
    axes[0, 0].axis("off")

    # Plot h1 in grayscale
    axes[0, 1].imshow(h1, cmap="gray")
    axes[0, 1].set_title("h1 Grayscale")
    axes[0, 1].axis("off")

    # Plot h2 in grayscale
    axes[1, 0].imshow(h2, cmap="gray")
    axes[1, 0].set_title("h2 Grayscale")
    axes[1, 0].axis("off")

    # Plot h3 in grayscale
    axes[1, 1].imshow(h3, cmap="gray")
    axes[1, 1].set_title("h3 Grayscale")
    axes[1, 1].axis("off")

    # Adjust layout and show plot
    plt.tight_layout()
    plt.show()



"""# Example usage
if __name__ == "__main__":
    # Example with 4 values
    values = []
    size = 3
    for i in range(4**size+3):
        values.append(i)
    print(len(values))
    values = prep_data_for_hilbert(values)
    print(len(values))
    result = hilbert_transform_1d_to_2d(values)
    plt.imshow(np.array(result))
    plt.gray()
    plt.show()
    #visualize_hilbert_path(result)
    # 
    # """