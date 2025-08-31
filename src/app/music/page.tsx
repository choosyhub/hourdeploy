
"use client";

import { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Play, Pause, Repeat, Repeat1, ListMusic, Music, SkipForward } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

interface AudioFile {
  file: File;
  url: string;
}

export default function MusicPage() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs for audio analysis
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();

  const currentTrack = currentTrackIndex !== null ? audioFiles[currentTrackIndex] : null;

  const handleNextTrack = useCallback(() => {
    if (audioFiles.length === 0) return;
    setCurrentTrackIndex(prevIndex => {
      const nextIndex = ((prevIndex ?? -1) + 1) % audioFiles.length;
      return nextIndex;
    });
    setIsPlaying(true);
  }, [audioFiles.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
        if (!isLooping) {
            handleNextTrack();
        }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
  }, [isLooping, handleNextTrack]);

  useEffect(() => {
    const setupAudioVisualizer = () => {
      if (audioRef.current && !audioContextRef.current) {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context;
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        const source = context.createMediaElementSource(audioRef.current);
        sourceRef.current = source;
        source.connect(analyser);
        analyser.connect(context.destination);
      }
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      if (!canvas || !analyser) return;

      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      
      let barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        
        const r = barHeight + (25 * (i / bufferLength));
        const g = 250 * (i / bufferLength);
        const b = 50;

        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      if (!audioContextRef.current) {
        setupAudioVisualizer();
      }
      if (audioContextRef.current?.state === 'running') {
        draw();
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: AudioFile[] = Array.from(files).map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setAudioFiles(prev => [...prev, ...newFiles]);
      if (currentTrackIndex === null) {
          setCurrentTrackIndex(0);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const selectTrack = (index: number) => {
    if (currentTrackIndex === index) {
        togglePlayPause();
    } else {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
    }
  };
  
  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }
    
    if(isPlaying) {
        audioRef.current?.pause();
    } else {
        audioRef.current?.play().catch(e => console.error("Playback failed", e));
    }
  }

  useEffect(() => {
    if (audioRef.current && currentTrack) {
        audioRef.current.src = currentTrack.url;
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed", e));
        }
    }
  }, [currentTrack?.url, isPlaying, currentTrack]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Music Player</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-6">
            <Card>
                <CardHeader>
                <CardTitle>Your Study Playlist</CardTitle>
                <CardDescription>Upload your own audio tracks to listen to.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={handleUploadClick}>
                            <Upload className="mr-2" /> Upload Audio
                        </Button>
                        <Input 
                            ref={fileInputRef}
                            type="file" 
                            accept="audio/*" 
                            multiple 
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                
                    {audioFiles.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Track</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {audioFiles.map((audio, index) => (
                                <TableRow key={audio.url} className={currentTrackIndex === index ? 'bg-primary/10' : ''}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Music className="w-4 h-4" />
                                        {audio.file.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={() => selectTrack(index)} variant={currentTrackIndex === index && isPlaying ? "secondary" : "default"}>
                                            {currentTrackIndex === index && isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                            {currentTrackIndex === index && isPlaying ? 'Pause' : 'Play'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                            <ListMusic className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Your playlist is empty.</p>
                            <p className="text-sm text-muted-foreground">Upload some audio files to get started.</p>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Now Playing</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-between h-full space-y-4">
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>

                    <div className="text-center">
                        <h3 className="font-semibold text-lg">{currentTrack?.file.name ?? "No track selected"}</h3>
                        <p className="text-sm text-muted-foreground">{currentTrack ? (isPlaying ? "Playing..." : "Paused") : "Select a track"}</p>
                    </div>
                
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setIsLooping(!isLooping)} size="icon" variant={isLooping ? "secondary" : "ghost"}>
                            {isLooping ? <Repeat1 /> : <Repeat />}
                        </Button>
                        <Button onClick={togglePlayPause} size="icon" disabled={!currentTrack}>
                            {isPlaying ? <Pause /> : <Play />}
                        </Button>
                        <Button onClick={handleNextTrack} size="icon" variant="ghost" disabled={!currentTrack}>
                            <SkipForward />
                        </Button>
                    </div>

                    <audio ref={audioRef} loop={isLooping} className="hidden" />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
