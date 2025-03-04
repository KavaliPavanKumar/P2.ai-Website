import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Download, Image, Type, Trash, Move, Plus, Minus } from 'lucide-react';

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  isDragging: boolean;
}

const MemeGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const memeRef = useRef<HTMLDivElement>(null);
  const [templates, setTemplates] = useState<string[]>([
    'https://images.unsplash.com/photo-1501820488136-72669149e0d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://plus.unsplash.com/premium_photo-1700391547713-ee7ec2838fd1?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1546587348-d12660c30c50?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: 'Add your text here',
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#ffffff',
      isDragging: false
    };
    setTextLayers([...textLayers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(
      textLayers.map(layer => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  };

  const removeTextLayer = (id: string) => {
    setTextLayers(textLayers.filter(layer => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setSelectedLayerId(id);
    updateTextLayer(id, { isDragging: true });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!memeRef.current) return;
    
    const draggingLayer = textLayers.find(layer => layer.isDragging);
    if (draggingLayer) {
      const rect = memeRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      updateTextLayer(draggingLayer.id, { x, y });
    }
  };

  const handleMouseUp = () => {
    textLayers.forEach(layer => {
      if (layer.isDragging) {
        updateTextLayer(layer.id, { isDragging: false });
      }
    });
  };

  const downloadMeme = async () => {
    if (memeRef.current) {
      try {
        const dataUrl = await toPng(memeRef.current, { quality: 0.95 });
        saveAs(dataUrl, 'my-meme.png');
      } catch (error) {
        console.error('Error generating meme:', error);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [textLayers]);

  const selectedLayer = textLayers.find(layer => layer.id === selectedLayerId);

  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
            Meme Generator
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Create viral-worthy memes in seconds. Add custom text, images, and effects with just a few clicks.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Meme Preview */}
          <div className="lg:w-2/3 bg-gray-800 rounded-xl p-6 shadow-lg">
            <div 
              ref={memeRef}
              onMouseMove={handleMouseMove}
              className="relative w-full h-[500px] bg-gray-700 rounded-lg overflow-hidden"
              style={{ backgroundImage: image ? `url(${image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {!image && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Upload an image or select a template</p>
                  </div>
                </div>
              )}
              
              {textLayers.map(layer => (
                <div
                  key={layer.id}
                  className={`absolute cursor-move ${selectedLayerId === layer.id ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-transparent' : ''}`}
                  style={{ 
                    left: `${layer.x}px`, 
                    top: `${layer.y}px`,
                    fontSize: `${layer.fontSize}px`,
                    color: layer.color,
                    textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                    userSelect: 'none'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, layer.id)}
                >
                  {layer.text}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button 
                onClick={addTextLayer}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Type className="w-5 h-5 mr-2" /> Add Text
              </button>
              <button 
                onClick={downloadMeme}
                disabled={!image}
                className={`flex items-center ${image ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'} text-white px-4 py-2 rounded-lg transition-colors`}
              >
                <Download className="w-5 h-5 mr-2" /> Download Meme
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:w-1/3 space-y-6">
            {/* Image Upload */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Image</h3>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-300 mb-2 block">Upload your own image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-purple-600 file:text-white
                      hover:file:bg-purple-700
                      cursor-pointer"
                  />
                </label>
                
                <div>
                  <p className="text-gray-300 mb-2">Or choose a template:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.map((template, index) => (
                      <div 
                        key={index}
                        className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${image === template ? 'border-purple-500' : 'border-transparent'}`}
                        onClick={() => setImage(template)}
                      >
                        <img 
                          src={template} 
                          alt={`Template ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Text Controls */}
            {selectedLayer && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Text Editor</h3>
                  <button 
                    onClick={() => removeTextLayer(selectedLayer.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Text</label>
                    <input
                      type="text"
                      value={selectedLayer.text}
                      onChange={(e) => updateTextLayer(selectedLayer.id, { text: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Font Size</label>
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateTextLayer(selectedLayer.id, { fontSize: Math.max(12, selectedLayer.fontSize - 2) })}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-l-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={selectedLayer.fontSize}
                        onChange={(e) => updateTextLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) || 12 })}
                        className="w-full bg-gray-700 border-y border-gray-600 px-3 py-2 text-white focus:outline-none text-center"
                      />
                      <button 
                        onClick={() => updateTextLayer(selectedLayer.id, { fontSize: selectedLayer.fontSize + 2 })}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-r-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Text Color</label>
                    <input
                      type="color"
                      value={selectedLayer.color}
                      onChange={(e) => updateTextLayer(selectedLayer.id, { color: e.target.value })}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Position</label>
                    <div className="flex gap-2">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">X</label>
                        <input
                          type="number"
                          value={Math.round(selectedLayer.x)}
                          onChange={(e) => updateTextLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Y</label>
                        <input
                          type="number"
                          value={Math.round(selectedLayer.y)}
                          onChange={(e) => updateTextLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      <Move className="w-4 h-4 inline mr-1" /> Or drag text directly on the image
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;