"use client"

import { useEffect, useState } from "react"
import { Plus, ListMusic, MoveRight, Loader2Icon, FilePlus2, CircleMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api, Media, Teacher, type Playlist } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Search, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

const formSchema = z.object({
    name_en: z.string().min(2, {
        message: "Name must be at least 2 characters."
    }).max(50),
    name_ml: z.string().max(50),
    totalDuration: z.string(),
    teacherId: z.string().pipe(z.string().transform(val => val.length == 0 ? undefined : val)),
    description_en: z.string(),
    description_ml: z.string(),
    isActive: z.boolean(),
    thumbnail: z.string(),
})

export default function PlaylistsPage() {
    const [media, setMedia] = useState<Media[]>([])
    const [loadingMedia, setLoadingMedia] = useState(false)
    const [mediaSearch, setMediaSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [myMedias, setMyMedias] = useState<any[]>([])
    const [myMediIds, setMyMediIds] = useState<string[]>([])
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [data, setData] = useState<any>(null)

    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [loadingTeachers, setLoadingTeachers] = useState(false)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(mediaSearch);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [mediaSearch]);

    const ids: { params: string[] } = useParams()
    const params = { id: ids?.params?.[0] }
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name_en: "",
            name_ml: "",
            description_en: "",
            description_ml: "",
            totalDuration: "",
            teacherId: "",
            thumbnail: "",
            isActive: true
        },
    })


    useEffect(() => {
        const abort = new AbortController()
        const fetchMedia = async () => {
            try {
                setLoadingMedia(true)
                const data = await api.getMedia(1, 30, mediaSearch, abort) // page, limit
                setMedia(data.filter((item) => item.isActive && !myMediIds.includes(item.id)))
            } catch (error) {
                console.error("Error fetching media:", error)
            } finally {
                setLoadingMedia(false)
            }
        }

        fetchMedia()

        return () => abort.abort()
    }, [debouncedQuery, myMediIds])

    useEffect(() => {
        if (params.id) {
            const fetchData = async () => {
                try {
                    // setLoadingMedia(true)
                    const data = await api.getPlaylistsById(params.id as string) // page, limit
                    console.log(data)
                    setData(data)
                    form.setValue('name_en', data.name_en || "")
                    form.setValue('name_ml', data.name_ml || "")
                    form.setValue("description_en", data.description_en || "")
                    form.setValue("description_ml", data.description_ml || "")
                    form.setValue("totalDuration", data.totalDuration || "")
                    form.setValue("thumbnail", data.thumbnail || "")

                    if (data?.mediaToPlaylist) {
                        const medias = data.mediaToPlaylist.map((m) => ({
                            name: m.mediaId.name_en,
                            duration: m.mediaId.duration,
                            createdAt: m.mediaId.createdAt,
                            isActive: m.mediaId.isActive,
                            id: m.mediaId.id
                        }))
                        setMyMedias(medias)
                        setMyMediIds(medias?.map((m) => m.id))
                    }
                } catch (error) {
                    console.error("Error fetching media:", error)
                } finally {
                    // setLoadingMedia(false)
                }
            }
            fetchData()
        }
    }, [])

    useEffect(() => {
        if (params.id && !loadingTeachers && data) {
            form.setValue('teacherId', data.teacherId || "")
        }
    }, [loadingTeachers, data])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            if (params.id) {
                await api.updatePlaylist(params.id, values)
                toast.success("Playlist Updated", {})
                setLoading(false)
            } else {
                const playlist = await api.createPlaylist(values);
                router.push(`/playlists/manage-playlist/${playlist.id}`)
            }
        } catch (error) {
            console.error("Error saving playlist:", error)
            setLoading(false)
        } finally {

        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoadingTeachers(true)
                const data = await api.getTeachers()
                setTeachers(data)
            } catch (error) {
                console.error("Error fetching teachers:", error)
            } finally {
                setLoadingTeachers(false)
            }
        }
        fetchTeachers()
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <ListMusic className="h-8 w-8" />
                        {`Playlists ${params.id ? ("/ " + params.id) : ""}`}
                    </h1>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4  gap-y-6">
                        <FormField
                            control={form.control}
                            name="name_en"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name (EN)</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name_ml"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name (ML)</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description_en"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (EN)</FormLabel>
                                    <FormControl>
                                        <Textarea  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description_ml"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (ML)</FormLabel>
                                    <FormControl>
                                        <Textarea  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="totalDuration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Duration</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="teacherId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={field.value}>Teacher</FormLabel>
                                    <Select
                                        {...field}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    // defaultValue={field.value}
                                    >

                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={loadingTeachers ? "Loading..." : "Select teacher"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Thumbnail URL</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <Button className="ml-auto" type="submit" disabled={loading}>
                        {loading ? "Saving..." : params.id ? "Update Playlist" : "Add Playlist"}
                    </Button>

                    {params.id && <>
                        <h2 className="mt-8 text-3xl">Add Medias</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid grid-cols-1 h-min gap-4">
                                <div className="relative flex-1 w-full  ">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search medias..."
                                        value={mediaSearch}
                                        onChange={(e) => {
                                            setMediaSearch(e.target.value)
                                        }}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="max-h-[65vh] py-2 flex flex-col gap-2 overflow-y-auto px-4 w-full">
                                    {media.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`flex gap-2 items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors`}
                                        >
                                            <div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center">
                                                <Clock className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium truncate">{item.name}</h4>
                                                    {item.isActive ? (
                                                        <Badge variant="default" className="text-xs">
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {/* {getTeacherName(item.teacherId)} */}
                                                        Name
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {item.duration}
                                                    </div>
                                                    <span>Added {formatDate(item.createdAt)}</span>
                                                </div>
                                            </div>
                                            <AddMediaToPlaylistBtn playlistId={params.id as string} mediaId={item.id} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-3xl">Selected Medias</h2>
                                <div className="max-h-[65vh] py-2 flex flex-col gap-2 overflow-y-auto w-full">
                                    {myMedias.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-2 items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center">
                                                <Clock className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium truncate">{item.name}</h4>
                                                    {item.isActive ? (
                                                        <Badge variant="default" className="text-xs">
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {/* {getTeacherName(item.teacherId)} */}
                                                        Name
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {item.duration}
                                                    </div>
                                                    <span>Added {formatDate(item.createdAt)}</span>
                                                </div>
                                            </div>
                                            <RemoveMediaFromPlaylistBtn playlistId={params.id as string} mediaId={item.id} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                    }

                </form>
            </Form>
        </div>
    )
}


function AddMediaToPlaylistBtn({ playlistId, mediaId }: { playlistId: string, mediaId: string }) {
    const [loading, setLoading] = useState(false)
    const add = async () => {
        try {
            setLoading(true)
            const data = await api.addMediaToPlaylist(playlistId, mediaId)
            window.location.reload()
        } catch (error) {
            console.error("Error fetching media:", error)
            setLoading(false)
        }
    }

    return (
        <Button className="cursor-pointer bg-green-500" disabled={loading} onClick={add} >
            {loading ? <Loader2Icon className="animate-spin" /> : <Plus />}
        </Button>
    )
}

function RemoveMediaFromPlaylistBtn({ playlistId, mediaId }: { playlistId: string, mediaId: string }) {
    const [loading, setLoading] = useState(false)
    const remove = async () => {
        try {
            setLoading(true)
            const data = await api.removeMediaFromPlaylist(playlistId, mediaId)
            window.location.reload()
        } catch (error) {
            console.error("Error fetching media:", error)
            setLoading(false)
        }
    }

    return (
        <Button className="cursor-pointer bg-red-500" disabled={loading} onClick={remove} >
            {loading ? <Loader2Icon className="animate-spin" /> : <CircleMinus />}
        </Button>
    )
}
