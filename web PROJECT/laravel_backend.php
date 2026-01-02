<?php
// ==================================================
// FILE: app/Http/Controllers/API/ProfileController.php
// ==================================================

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show()
    {
        $profile = Profile::first();
        
        if (!$profile) {
            // Return default profile
            return response()->json([
                'success' => true,
                'data' => [
                    'name' => 'John Doe',
                    'job_title' => 'Full-Stack Developer',
                    'bio' => 'Passionate developer creating amazing digital experiences.',
                    'profile_image' => null
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $profile
        ]);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $profile = Profile::firstOrNew(['id' => 1]);

        // Update text fields
        if ($request->has('name')) {
            $profile->name = $request->name;
        }
        if ($request->has('job_title')) {
            $profile->job_title = $request->job_title;
        }
        if ($request->has('bio')) {
            $profile->bio = $request->bio;
        }

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old image if exists
            if ($profile->profile_image) {
                Storage::disk('public')->delete($profile->profile_image);
            }

            // Store new image
            $path = $request->file('profile_image')->store('profiles', 'public');
            $profile->profile_image = Storage::url($path);
        }

        $profile->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $profile
        ]);
    }
}


// ==================================================
// FILE: routes/api.php
// ==================================================

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\SkillController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProfileController;

// Public API Routes
Route::prefix('v1')->group(function () {
    // Skills
    Route::get('/skills', [SkillController::class, 'index']);
    
    // Projects
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    
    // Blog
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/{slug}', [BlogController::class, 'show']);
    
    // Contact
    Route::post('/contact', [ContactController::class, 'store']);
    
    // Profile (Public)
    Route::get('/profile', [ProfileController::class, 'show']);
});

// Protected Admin Routes
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    // Skills Management
    Route::apiResource('skills', SkillController::class)->except(['index']);
    
    // Projects Management
    Route::apiResource('projects', ProjectController::class)->except(['index', 'show']);
    
    // Blog Management
    Route::apiResource('blogs', BlogController::class)->except(['index', 'show']);
    
    // Profile Management
    Route::post('/profile', [ProfileController::class, 'update']);
    
    // Dashboard Stats
    Route::get('/stats', function () {
        return response()->json([
            'total_projects' => \App\Models\Project::count(),
            'total_blogs' => \App\Models\Blog::count(),
            'total_skills' => \App\Models\Skill::count(),
            'total_messages' => \App\Models\Contact::count(),
        ]);
    });
});

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


// ==================================================
// FILE: app/Http/Controllers/API/SkillController.php
// ==================================================

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('order', 'asc')->get();
        return response()->json([
            'success' => true,
            'data' => $skills
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'level' => 'required|integer|min:0|max:100',
            'category' => 'nullable|string|max:100',
            'order' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $skill = Skill::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Skill created successfully',
            'data' => $skill
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $skill = Skill::find($id);
        
        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'level' => 'integer|min:0|max:100',
            'category' => 'nullable|string|max:100',
            'order' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $skill->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Skill updated successfully',
            'data' => $skill
        ]);
    }

    public function destroy($id)
    {
        $skill = Skill::find($id);
        
        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found'
            ], 404);
        }

        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully'
        ]);
    }
}


// ==================================================
// FILE: app/Http/Controllers/API/ProjectController.php
// ==================================================

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }

    public function show($id)
    {
        $project = Project::find($id);
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $project
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack' => 'required|string',
            'image' => 'nullable|string',
            'demo_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'status' => 'in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->title);

        $project = Project::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::find($id);
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'tech_stack' => 'string',
            'image' => 'nullable|string',
            'demo_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'status' => 'in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        if ($request->has('title')) {
            $data['slug'] = Str::slug($request->title);
        }

        $project->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project
        ]);
    }

    public function destroy($id)
    {
        $project = Project::find($id);
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully'
        ]);
    }
}


// ==================================================
// FILE: app/Http/Controllers/API/BlogController.php
// ==================================================

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $blogs
        ]);
    }

    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)->first();
        
        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found'
            ], 404);
        }

        // Increment views
        $blog->increment('views');

        return response()->json([
            'success' => true,
            'data' => $blog
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'image' => 'nullable|string',
            'tags' => 'nullable|string',
            'status' => 'in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->title);
        $data['published_at'] = $request->status === 'published' ? now() : null;

        $blog = Blog::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Blog created successfully',
            'data' => $blog
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::find($id);
        
        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'content' => 'string',
            'excerpt' => 'nullable|string|max:500',
            'image' => 'nullable|string',
            'tags' => 'nullable|string',
            'status' => 'in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        if ($request->has('title')) {
            $data['slug'] = Str::slug($request->title);
        }
        
        if ($request->status === 'published' && !$blog->published_at) {
            $data['published_at'] = now();
        }

        $blog->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Blog updated successfully',
            'data' => $blog
        ]);
    }

    public function destroy($id)
    {
        $blog = Blog::find($id);
        
        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found'
            ], 404);
        }

        $blog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Blog deleted successfully'
        ]);
    }
}


// ==================================================
// FILE: app/Http/Controllers/API/ContactController.php
// ==================================================

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $contact = Contact::create($request->all());

        // Optional: Send email notification
        // Mail::to('admin@example.com')->send(new ContactFormMail($contact));

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully! We will get back to you soon.'
        ], 201);
    }
}


// ==================================================
// FILE: app/Http/Controllers/API/AuthController.php
// ==================================================

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}


// ==================================================
// FILE: database/migrations/create_tables.php
// ==================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Skills Table
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('level')->default(0);
            $table->string('category')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Projects Table
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('tech_stack');
            $table->string('image')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('github_url')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
        });

        // Blogs Table
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->text('excerpt')->nullable();
            $table->string('image')->nullable();
            $table->string('tags')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->integer('views')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // Contact Messages Table
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // Profile Table
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('job_title')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_image')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('skills');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('blogs');
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('profiles');
    }
};


// ==================================================
// FILE: app/Models/Skill.php
// ==================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = [
        'name', 'level', 'category', 'order'
    ];

    protected $casts = [
        'level' => 'integer',
        'order' => 'integer'
    ];
}


// ==================================================
// FILE: app/Models/Project.php
// ==================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'tech_stack', 
        'image', 'demo_url', 'github_url', 'status'
    ];
}


// ==================================================
// FILE: app/Models/Blog.php
// ==================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'title', 'slug', 'content', 'excerpt', 
        'image', 'tags', 'status', 'published_at', 'views'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'views' => 'integer'
    ];
}


// ==================================================
// FILE: app/Models/Contact.php
// ==================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'name', 'email', 'subject', 'message', 'is_read'
    ];

    protected $casts = [
        'is_read' => 'boolean'
    ];
}


// ==================================================
// FILE: app/Models/Profile.php
// ==================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name', 'job_title', 'bio', 'profile_image'
    ];
}