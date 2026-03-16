export default function Createexperience() {
    return (
        <div className="min-h-screen w-full flex bg-background">
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link href="/">
                            <div className="inline-flex items-center gap-2 mb-8 cursor-pointer">
                                <GraduationCap className="h-8 w-8 text-primary" />
                                <span className="font-bold text-xl tracking-tight text-primary">Est Next Step</span>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Share Your Experience</h1>
                        <p className="text-muted-foreground mt-2">Inspire the next generation by sharing your journey.</p>
                    </div>
                    <form className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Experience Title</Label>
                            <Input id="title" type="text" placeholder="My Journey to Success" className="bg-background" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Experience Content</Label>
                            <Textarea id="content" rows={6} placeholder="Share your story..." className="bg-background" />
                        </div>
                        <Button type="submit" className="w-full">
                            Submit Experience
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}